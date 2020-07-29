import React, { useContext } from "react";
import { themeContext } from "../common/context";
import { i18nContext } from "../common/context";
import themeList from "../../datas/theme";

const Panel = () => {
	const { i18n } = useContext(i18nContext);
	const { theme, setTheme } = useContext(themeContext);
	const handleTheme = _theme => {
		if (theme !== _theme) {
			document.querySelector("html").setAttribute("class", _theme);
			setTheme(_theme);
		}
	};
	return (
		<div className="mode">
			<i className="icon icon-contrast">{i18n.lbl_Themes}</i>
			<div>
				<button
					className={`icon icon-sun${
						theme === themeList.default ? " open" : ""
					}`}
					onClick={handleTheme.bind(
						null,
						themeList.default
					)}></button>
				<button
					className={`icon icon-moon${
						theme === themeList.dark ? " open" : ""
					}`}
					onClick={handleTheme.bind(null, themeList.dark)}></button>
			</div>
		</div>
	);
};

export default Panel;
