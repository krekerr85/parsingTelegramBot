export function markdownV2Format(str: string) {
	const formattedStr = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	return formattedStr;
}

