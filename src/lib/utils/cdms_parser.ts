import * as cheerio from 'cheerio';

function endash_str(str: string) {
	return str.replaceAll('–', '-').trim();
}

export function CDMS_Parser(cdms_data: string) {
	if (!cdms_data) throw new Error('No data provided');
	const C$ = cheerio.load(cdms_data);

	const ref_element = C$('p font[color="#064898"]');
	const references: string[] = [];
	const td_val = C$("td[align='right']");

	const td_parent = td_val.parent();
	const full_info = {};

	for (const arr of td_parent.toArray()) {
		const key = C$(arr?.firstChild).text().trim();

		let value: string | string[] = '';
		if (key === 'Contributor') {
			if (C$(arr.lastChild).html()?.includes('<br>')) {
				value = C$(arr.lastChild).html()?.split('<br>');
			} else {
				value = [endash_str(C$(arr.lastChild).text().trim())];
			}
		} else {
			value = endash_str(C$(arr.lastChild).text().trim());
		}
		full_info[endash_str(key)] = value;
	}

	for (const element of ref_element.toArray()) {
		let ref = C$(element).text();
		ref = ref.replaceAll(/(\(\d\))/g, '').trim();
		ref = ref.replaceAll('\n', ' ').replaceAll('  ', ' ');
		references.push(endash_str(ref));
	}

	const heading = C$("caption font:not([color='red'])");
	const [name_formula, ...name_formula_meta] = heading.text()?.trim()?.split(/[, ]/g);
	const [name_html, ...name_html_meta] = heading.html()?.split(/[, ]/g) ?? '';
	const iupac_name = C$('caption').text().split('\n')[1].split(/[,;]/g)[0];
	const [, ...name_meta] =
		C$('caption')
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
