import Cite from 'citation-js';

export default async function ({ doi = '', bibtex = '' }) {
	if (!(doi || bibtex)) throw new Error('doi and bibtex are both empty');
	const doi_mode = !!doi;
	console.log({ doi_mode, doi, bibtex });

	const parsed_data = await Cite.async(doi_mode ? doi : bibtex);
	if (parsed_data.data.length === 0) throw new Error('No data found');
	const data = parsed_data.data[0];

	// console.log(data);

	const { author, issued, URL: href } = data;
	const first_author = doi_mode
		? author.find((a: { sequence: string }) => a.sequence === 'first')
		: author[0];

	// console.log({ author, issued, href, first_author });

	const author_clean = first_author.family + (author.length > 1 ? ' et al.' : '');
	const year = issued['date-parts'][0][0];
	const citeas = `${author_clean} (${year})`;

	const tooltip = `${data['container-title']}`;
	const parsed = parsed_data.format('bibliography', {
		format: 'text',
		template: 'apa',
		lang: 'en-US'
	});

	const bibtex_text = parsed_data.format('bibtex');
	const citation_key = bibtex_text.match(/@article\{(.+),/)?.[1];
	const blob = new Blob([bibtex_text], { type: 'text/plain' });
	const bibtex_download_href = URL.createObjectURL(blob);

	return { citeas, href, tooltip, parsed, bibtex_text, bibtex_download_href, citation_key };
}
