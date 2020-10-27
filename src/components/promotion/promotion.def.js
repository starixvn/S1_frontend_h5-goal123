export const promoStatus = {
	Running: 1,
	Canceled: 2,
	Expiry: 3,
	TransferOut: 5
};

export const defPromotionType = {
	firstDeposit: 1,
	reDeposit: 2,
	freeBet: 3,
	walletBonus: 5,
	rebate: 6,
	cashback: 7
};

export const defFilterType = {
	all: 0,
	expiry: 999,
	firstDeposit: 1,
	freeBet: 3
};

export const defPromoNavs = [
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
