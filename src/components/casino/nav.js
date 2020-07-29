import React, { useContext } from "react";
import defNav from "./defNav";
import { i18nContext } from "../common/context";

const Nav = props => {
	const { i18n } = useContext(i18nContext);

	let rows = Object.keys(defNav).map(k => {
		let _nav = defNav[k];
		return (
			<button
				key={`casino-nav-${k}`}
				className={props.selNav === k ? "open" : ""}
				onClick={props.SelectNav.bind(this, k)}>
				{i18n[_nav.displayKey]}
			</button>
		);
	});

	return <div className="inputBox filterBtn">{rows}</div>;
};

export default Nav;
