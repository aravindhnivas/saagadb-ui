<script lang="ts">
	import { getForm } from 'formsnap';
	import AutoFillName from '../auto-fill-name.svelte';

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
		$form.molecule_tag = data['Species tag'];
		console.log({ db, data, $form }, data['Species tag']);
		const qpart = [];
		for (const key in data) {
			if (!key.match(/Q\(\d+.(\d+)?\)/g)) continue;
			// qpart[key.replace(/[Q\(\)]/g, '')] = data[key];
			const temp = key.replace(/[Q\(\)]/g, '');
			const val = data[key];
			qpart.push(`${temp}\t${val}`);
		}
		$form.qpart_file = qpart.join('\n');
		console.log(qpart, data['µa / D']);
		$form.data_contributor = data['Contributor']?.join(', ');

		if (db === 'cdms') {
			for (const rot_key of ['A', 'B', 'C']) {
				const key1 = `${rot_key} / MHz`;
				const fkey = rot_key.toLowerCase();
				if (key1 in data) {
					$form[`${fkey}_const`] = data[key1];
				} else if (rot_key in data[rot_key]) {
					$form[`${fkey}_const`] = data[rot_key];
				}
			}

			if (data['µa / D']) $form.mu_a = data['µa / D'];
			if (data['μb / D']) $form.mu_b = data['μb / D'];
			if (data['μc / D']) $form.mu_c = data['μc / D'];
			$form['data_date'] = date_formatter(data['Date of Entry']);
		} else if (db === 'jpl') {
			$form['data_date'] = date_formatter(data['Date']);
			if (data['mu_a']) $form.mu_a = data['mu_a'];
			if (data['mu_b']) $form.mu_b = data['mu_b'];
			if (data['mu_c']) $form.mu_c = data['mu_c'];
			for (const rot_key of ['A', 'B', 'C']) {
				console.log(rot_key, data[rot_key]);
				const fkey = rot_key.toLowerCase();
				$form[`${fkey}_const`] = data[rot_key];
			}
		}
	};
</script>

<AutoFillName class="border-gray border-2 rounded-2 p-2" {callback} />