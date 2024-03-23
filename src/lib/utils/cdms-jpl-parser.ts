import * as cheerio from 'cheerio';

function endash_str(str: string) {
	return str.replaceAll('–', '-').trim();
}

export async function CDMS(html_data: string) {
	if (!html_data) throw new Error('No data provided');

	const $ = cheerio.load(html_data);
	// const ref_full = $('p[align="justify"]');
	// console.log(ref_full.html());
	// console.log(ref_full.text())

	const ref_element = $('p[align="justify"] font[color="#064898"]');

	const references: string[] = ref_element
		.text()
		.split(/\(\d+\)\s/g)
		.filter((f) => f.trim().length > 0)
		.map((f) => f.replaceAll('\n', ' ').trim());

	const td_val = $("td[align='right']");
	const td_parent = td_val.parent();

	const full_info: {
		[key: string]: string | string[];
	} = {};

	for (const el of td_parent.toArray()) {
		if (!el.firstChild || !el.lastChild) continue;
		const key = $(el.firstChild)?.text().trim();
		let value: string | string[] = '';

		if (key === 'Contributor') {
			if ($(el.lastChild).html()?.includes('<br>')) {
				value = $(el.lastChild).html()?.split('<br>') || [];
			} else {
				value = [endash_str($(el.lastChild).text().trim())];
			}
		} else if (key.match(/Q\(\d+\.?\d*?\)/g)) {
			const qpart_value = endash_str($(el.lastChild).text().trim());
			const match = qpart_value.match(/^[^\s(]+/);
			value = match ? match[0] : '';
			// console.log({ key, value, match });
		} else {
			value = endash_str($(el.lastChild).text().trim());
		}
		// console.log({ key, value });
		full_info[endash_str(key)] = value;
	}

	// for (const element of ref_element.toArray()) {
	// 	let ref = $(element).text();
	// 	ref = ref.replaceAll(/(\(\d\))/g, '').trim();
	// 	ref = ref.replaceAll('\n', ' ').replaceAll('  ', ' ');
	// 	references.push(endash_str(ref));
	// }

	const heading = $("caption font:not([color='red'])");
	const [name_formula, ...name_formula_meta] = heading.text()?.trim()?.split(/[, ]/g);
	const [name_html, ...name_html_meta] =
		heading
			.html()
			?.replace(/<\/?font.*?>/g, '')
			.split(/[, ]/g) ?? '';

	const iupac_name = $('caption').text().split('\n')[1].split(/[,;]/g)[0];
	const [, ...name_meta] =
		$('caption')
			.html()
			?.split('\n')[1]
			.split(/[,;]/g)
			.map((f) => endash_str(f.trim())) ?? [];

	const name = {
		default: endash_str(iupac_name),
		meta: name_meta.join(', '),
		formula: {
			default: endash_str(name_formula),
			meta: endash_str(name_formula_meta.join(' ').replaceAll('  ', ', '))
		},
		html: {
			default: endash_str(name_html),
			meta: endash_str(name_html_meta.join(' ').replaceAll('  ', ', '))
		}
	};
	const processed_informations = { name, ...full_info, references };
	return processed_informations;
}

const sanitize_latext_to_string = (str: string) => {
	return str
		.replaceAll(/[$\^\{\}]/g, '')
		.replaceAll('~', ' ')
		.replaceAll('\\&', '&')
		.replaceAll('\\it', '')
		.replaceAll('\\bf', '')
		.replaceAll('  ', ' ')
		.replaceAll('\\', '')
		.trim();
};

export async function JPL(html_data: string = '') {
	if (!html_data) throw new Error('No data provided');
	const [entries, ref] = html_data.split('headend');
	const reference = sanitize_latext_to_string(ref)
		.split('\n')
		.map((f) => f.trim())
		.filter((f) => f);

	const raw_data = entries
		.replaceAll(/[\\\\\$\^\{\}:]/g, '')
		.split('\n')
		.map((f) => f.trim());

	const name_meta: string[] = [];
	const props: {
		[key: string]: string | string[];
		Contributor: string[];
		reference: string[];
	} = { Contributor: [], reference: [] };
	let start_second_part = false;
	for (const ln of raw_data) {
		const splitted_key_val = ln.split('&').map((f) => f.trim());
		if (splitted_key_val.join('').trim() === '') continue;
		if (ln.includes('Lines Listed ')) {
			start_second_part = true;
		}

		let [k1, v1, k2, v2] = splitted_key_val as string[];
		k1 = k1?.replaceAll(/[=]/g, '').trim() || '';
		k2 = k2?.replaceAll(/[=]/g, '').trim() || '';

		if (k1.match(/[><]/g)) {
			const parts = k1.split(' ');
			k1 = parts.slice(0, -1).join(' ');
			v1 = parts[parts.length - 1] + ' ' + v1;
		}

		if (start_second_part) {
			if (k1) props[k1] = v1;
			if (k2) props[k2] = v2;
		} else {
			if (k1 === 'Contributor' && v1) {
				props['Contributor'].push(v1);
				if (k2 && v2) {
					props[k2] = v2;
				}

				if (!k2 && v2) {
					name_meta.push(v2);
				}
				continue;
			}

			if (!k1 && v1) {
				props['Contributor'].push(v1);
			}

			if (k1 && v1) {
				props[k1] = v1;
			}
			if (k2 && v2) {
				props[k2] = v2;
			}
			if (!k2 && v2) {
				name_meta.push(v2);
			}
		}
	}

	const qkeys = Object.keys(props).filter((f) => f.match(/Q\(\d+\.\d+?\)/g));
	const qpart: {
		[key: string]: string | string[];
	} = {};
	qkeys.forEach((f) => {
		qpart[f] = props[f];
		delete props[f];
	});

	console.log('finished fetching JPL data');
	return { name_meta, ...props, ...qpart, reference, raw_data };
}

export async function fetch_all_cdms_ref(cdms_html: string) {
	console.log('fetching CDMS data');
	// const cdms_tag_url = await url_from_cdms_tag(tag);
	// console.log(cdms_tag_url);
	// const res = await axios.get(cdms_tag_url);
	// const cdms_html = res.data;
	const $ = cheerio.load(cdms_html);

	const ref_texts = $('font[color="#064898"]').text();
	// console.log(ref_texts);

	const entries = ref_texts
		.split(/\(\d+\)\s/g)
		.filter((f) => f.trim().length > 0)
		.map((f) => f.replaceAll('\n', ' ').trim());
	// console.log(entries, entries.length);

	console.log('finished fetching CDMS data');
	return entries;
}
