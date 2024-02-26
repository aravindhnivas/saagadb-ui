export const url_from_jpl_tag = (tag: string | number, get_pdf = false) => {
	const tag_num = String(tag).padStart(6, '0');
	const link = `https://spec.jpl.nasa.gov/ftp/pub/catalog/doc/d${tag_num}.cat`;
	if (get_pdf) return link.replace('.cat', '.pdf');
	return link;
};

export const url_from_cdms_tag = (tag: string | number) => {
	const tag_num = String(tag).padStart(6, '0');
	return `https://cdms.astro.uni-koeln.de/cgi-bin/cdmsinfo?file=e${tag_num}.cat`;
};

export const sleep = (delay: number = 1000) => new Promise((resolve) => setTimeout(resolve, delay));
