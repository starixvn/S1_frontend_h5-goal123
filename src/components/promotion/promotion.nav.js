import React from "react";
import { defPromoNavs } from "./promotion.def";

export default ({ i18n, selected, selectPromoType }) => {
	let arr = defPromoNavs.map(p => {
		return (
			<button
				key={`promo-nav-${p.displayKey}`}
				className={p.value === selected ? "open" : ""}
				onClick={selectPromoType.bind(this, p.value)}>
				{i18n[`${p.displayKey}`]}
			</button>
		);
	});
	return <>{arr}</>;
};
