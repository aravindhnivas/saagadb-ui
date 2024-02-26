<script lang="ts">
	import { getForm } from 'formsnap';
	import AutoFillName from '../auto-fill-name.svelte';
	import { getContext } from 'svelte';

	const species = getContext('species') as Species[];
	const linelist = getContext('linelist') as Linelist[];
	// console.log({ species, linelist });

	const { form } = getForm();
	const date_formatter = (dateStr: string) => {
		// const dateStr = 'May 2018';
		const date = new Date(dateStr);

		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() returns a 0-based month, so we add 1
		const day = 1; // set the day to 1 as it's not provided in the original string

		const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

		console.log(formattedDate);
		return formattedDate;
	};
	const callback = (db: string, data: Object) => {
		const tag_key = Object.keys(data).filter((k) => k.match(/species tag/i))[0];
		if (tag_key) $form['molecule_tag'] = data[tag_key];

		console.log({ db, data, $form });

		const qpart_keys = Object.keys(data).filter((k) => k.match(/Q\(\d+.(\d+)?\)/g));
		const qpart = [];
		for (const qpart_key of qpart_keys) {
			const temp = qpart_key.replace(/[Q\(\)]/g, '');
			const val = data[qpart_key];
			qpart.push(`${temp}\t${val}`);
		}

		$form.qpart_file = '#form : interpolation \n' + qpart.join('\n');
		$form.data_contributor = data['Contributor']?.join(', ');

		const dipole_keys = Object.keys(data).filter((k) => k.match(/(µ|mu_)[a-c]( \/ D)?/g));
		console.log({ dipole_keys });
		for (const dipole_key of dipole_keys) {
			const fkey = dipole_key
				.replace(/(µ|mu_)/g, '')
				.replace(/ \/ D/g, '')
				.toLowerCase();
			console.log(`mu_${fkey}`, data[dipole_key]);
			$form[`mu_${fkey}`] = data[dipole_key];
		}

		const rot_const_keys = Object.keys(data).filter((k) => k.match(/\b(A|B|C)( \/ MHz)?\b/g));
		// Word boundaries (\b) ensure that the match is a whole word and not part of a larger word.
		console.log({ rot_const_keys });
		for (const rot_key of rot_const_keys) {
			const fkey = rot_key.replace(/ \/ MHz/g, '').toLowerCase();
			console.log(`${fkey}_const`, data[rot_key]);
			$form[`${fkey}_const`] = data[rot_key];
		}

		const date_key = Object.keys(data).filter((k) => k.match(/(Date)/g))[0];
		if (date_key) $form['data_date'] = date_formatter(data[date_key]);

		if (db === 'cdms') {
			const { name } = data;

			const found_species = species.find((s) => s.name_formula === name.formula.default);
			const found_linelist = linelist.find(
				(l) => l.linelist_name.toLowerCase() === db.toLowerCase()
			);

			$form.species = found_species?.id;
			$form.linelist = found_linelist?.id;
		} else if (db === 'jpl') {
			const found_species = species.find((s) => s.name_formula === data.Name);
			const found_linelist = linelist.find(
				(l) => l.linelist_name.toLowerCase() === db.toLowerCase()
			);
			$form.species = found_species?.id;
			$form.linelist = found_linelist?.id;
		}
		console.log('parsed', { $form });
	};
</script>

<AutoFillName class="border-gray border-2 rounded-2 p-2" {callback} />
