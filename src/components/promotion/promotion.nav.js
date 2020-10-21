import React from "react";

export const defFilterType = {
	all: 0,
	expiry: 999,
	firstDeposit: 1,
	freeBet: 3
};

const defPromoNavs = [
	{
		displayKey: "lbl_All",
		value: defFilterType.all
	},
	{
		displayKey: "lbl_PromotionCategory1",
		value: defFilterType.firstDeposit
	},
	{
		displayKey: "lbl_FreeBet",
		value: defFilterType.freeBet
	}
];

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
