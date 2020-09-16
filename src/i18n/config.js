import { GET_LANG_ID } from "../service/language";
import { siteInfo } from "../config";
export const langList = ["en", "vn"];
export const defaultLang = siteInfo().siteDefaultLang;

export default lang => {
	let _lang = lang ? lang : GET_LANG_ID();
	if (!langList.includes(_lang)) {
		_lang = defaultLang;
	}

	return require(`./${_lang}.json`);
};

export const ReplaceStr = (str, patterns) => {
	Object.keys(patterns).forEach(p => {
		str = str.replace(`{{${p}}}`, patterns[p]);
	});

	return str;
};
