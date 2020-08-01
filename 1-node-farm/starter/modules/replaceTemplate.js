const replaceTemplate = (temp, product) => {
	let output = temp;

	for (const key in product) {
		if (key == 'organic') {
			output = !product.organic
				? output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
				: output.replace(/{%NOT_ORGANIC%}/g, '');
		} else {
			let pattern = new RegExp(`{%${key.toUpperCase()}%}`, 'g');
			output = output.replace(pattern, product[key]);
		}
	}
	return output;
};

const PI = 3.14159265358979323846264338327950288;

module.exports = { replaceTemplate, PI };
