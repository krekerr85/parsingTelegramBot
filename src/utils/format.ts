export function markdownV2Format(str: string) {
	const formattedStr = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	console.log(formattedStr);
	return formattedStr;
}

