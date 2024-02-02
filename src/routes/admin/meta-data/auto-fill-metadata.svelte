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
		const qpart = {};
		for (const key in data) {
			if (!key.match(/Q\(\d+.(\d+)?\)/g)) continue;
			qpart[key.replace(/[Q\(\)]/g, '')] = data[key];
		}

		console.log(qpart, data['µa / D']);
		$form.data_contributor = data['Contributor']?.join(', ');

		for (const rot_key of ['A', 'B', 'C']) {
			const key1 = `${rot_key} / MHz`;
			const fkey = rot_key.toLowerCase();
			if (key1 in data) {
				$form[`${fkey}_const`] = data[key1];
			} else if (rot_key in data[rot_key]) {
				$form[`${fkey}_const`] = data[rot_key];
			}
		}

		if (db === 'cdms') {
			if (data['µa / D']) $form.mu_a = data['µa / D'];
			if (data['μb / D']) $form.mu_b = data['μb / D'];
			if (data['μc / D']) $form.mu_c = data['μc / D'];
			const date = data['Date of Entry'];
			$form['data_date'] = date_formatter(date);
		} else if (db === 'jpl') {
		}
	};
</script>

<AutoFillName class="border-gray border-2 rounded-2 p-2" {callback} />
