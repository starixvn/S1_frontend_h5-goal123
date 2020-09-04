import Sport from "../styles/img/sport.jpg";
import Virtual_sports from "../styles/img/virtual_sports.jpg";
import Esports from "../styles/img/e-sports.jpg";
import LIVEcasino_DG from "../styles/img/LIVEcasino_DG.jpg";
import LIVEcasino_PP from "../styles/img/LIVEcasino_PP.jpg";
import LIVEcasino_AE from "../styles/img/LIVEcasino_AE.jpg";
import LIVEcasino_AG from "../styles/img/LIVEcasino_AG.jpg";
import LIVEcasino_AB from "../styles/img/LIVEcasino_AB.jpg";
import LIVEcasino_SA from "../styles/img/LIVEcasino_SA.jpg";
import Coming_soon from "../styles/img/coming_soon.jpg";
import Casino_ow from "../styles/img/casino_OW.jpg";
import Casino_PP from "../styles/img/casino_PP.jpg";
import Casino_SG from "../styles/img/casino_SG.jpg";
import Casino_PG from "../styles/img/casino_PG.jpg";
import Casino_JOKER from "../styles/img/casino_JOKER.jpg";
import Casino_YGG from "../styles/img/casino_YGG.jpg";
import Casino_GPI from "../styles/img/casino_GPI.jpg";
import Fish from "../styles/img/fish.jpg";
import Id4d from "../styles/img/id4d.jpg";
import Keno from "../styles/img/keno.jpg";
import Lottery from "../styles/img/lottery.jpg";
import Number_game from "../styles/img/number_game.jpg";

const gameList = [
	{
		category: "sports",
		categoryIcon: "sports",
		translateKey: "lbl_Sports",
		items: [
			{
				icon: "soccer",
				gameId: 1,
				tpId: 1,
				img: Sport,
				spanTextKey: "lbl_Sports"
			},
			{
				icon: "virtual-sports",
				gameId: 180,
				tpId: 1,
				img: Virtual_sports,
				spanTextKey: "lbl_VirtualSports"
			}
		]
	},
	{
		category: "virtualsports",
		categoryIcon: "e-sports",
		translateKey: "lbl_eSports",
		items: [
			{
				icon: "e-sports",
				gameId: 43,
				img: Esports,
				tpId: 1,
				spanTextKey: "lbl_eSports"
			}
		]
	},
	{
		category: "livecasino",
		categoryIcon: "livecasino",
		className: "casinoList",
		translateKey: "lbl_LiveCasino",
		comingSoonImg: `coming_soon.jpg`,
		items: [
			{
				gameId: 4,
				tpId: 4,
				img: LIVEcasino_DG
			},
			{
				gameId: 101,
				tpId: 5,
				img: LIVEcasino_PP
			},
			{
				gameId: 15,
				tpId: 15,
				img: LIVEcasino_AE
			},
			{
				gameId: 3,
				tpId: 3,
				img: LIVEcasino_AG
			},
			{
				gameId: 12,
				tpId: 12,
				img: LIVEcasino_AB
			},
			{
				gameId: 2,
				tpId: 2,
				img: LIVEcasino_SA
			}
		]
	},
	{
		category: "casino",
		categoryIcon: "casino",
		className: "casinoList",
		translateKey: "lbl_Casino",
		comingSoonImg: Coming_soon,
		items: [
			{
				gameId: 208,
				tpId: 1,
				img: Casino_ow
			},
			{
				tpId: 5,
				parameter: { tpId: 5 },
				img: Casino_PP
			},
			{
				tpId: 10,
				parameter: { tpId: 10 },
				img: Casino_SG
			},
			{
				tpId: 14,
				parameter: { tpId: 14 },
				img: Casino_PG
			},
			{
				tpId: 9,
				parameter: { tpId: 9 },
				img: Casino_JOKER
			},
			{
				tpId: 8,
				parameter: { tpId: 8 },
				img: Casino_YGG
			},
			{
				tpId: 6,
				parameter: { tpId: 6 },
				img: Casino_GPI
			}
		]
	},
	{
		category: "game",
		categoryIcon: "game",
		translateKey: "lbl_Fishing",
		items: [
			{
				icon: "game",
				gameId: 10,
				tpId: 7,
				img: Fish,
				spanTextKey: "lbl_Fishing"
			}
		]
	},
	{
		category: "kelo",
		categoryIcon: "kelo",
		translateKey: "lbl_Lottery",
		items: [
			{
				icon: "lottery",
				gameId: 223,
				tpId: 1,
				img: Id4d,
				spanTextKey: "lbl_Indo4d",
				allowCurrency: [4, 15]
			},
			{
				icon: "keno",
				gameId: 202,
				tpId: 1,
				img: Keno,
				spanTextKey: "lbl_Keno"
			},
			{
				icon: "lottery",
				gameId: 220,
				tpId: 1,
				img: Lottery,
				spanTextKey: "lbl_Lottery"
			},
			{
				icon: "lottery",
				gameId: 161,
				tpId: 1,
				img: Number_game,
				spanTextKey: "lbl_NumberGame"
			}
		]
	}
];

export default gameList;
