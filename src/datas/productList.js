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

export const defGameInfo = {
	Sports: { tpId: 1, gameId: 1 },
	VirtualSports: { tpId: 1, gameId: 180 },
	eSports: { tpId: 1, gameId: 43 },
	LIVEcasinoDG: { tpId: 4, gameId: 4 },
	LIVEcasinoPP: { gameId: 101, tpId: 5 },
	LIVEcasinoAE: { gameId: 15, tpId: 15 },
	LIVEcasinoAG: { gameId: 3, tpId: 3 },
	LIVEcasinoAB: { gameId: 12, tpId: 12 },
	LIVEcasinoSA: { gameId: 2, tpId: 2 },
	Casino_ow: { gameId: 208, tpId: 1 },
	Casino_PP: { tpId: 5 },
	Casino_SG: { tpId: 10 },
	Casino_PG: { tpId: 14 },
	Casino_JOKER: { tpId: 9 },
	Casino_YGG: { tpId: 8 },
	Casino_GPI: { tpId: 6 },
	Fishing: { gameId: 10, tpId: 7 },
	Indo4d: { gameId: 223, tpId: 1 },
	Keno: { gameId: 202, tpId: 1 },
	lottery: { gameId: 220, tpId: 1 },
	NumberGame: { gameId: 161, tpId: 1 }
};

const gameList = [
	{
		category: "sports",
		categoryIcon: "sports",
		translateKey: "lbl_Sports",
		items: [
			{
				...defGameInfo.Sports,
				icon: "soccer",
				img: Sport,
				spanTextKey: "lbl_Sports"
			},
			{
				...defGameInfo.VirtualSports,
				icon: "virtual-sports",
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
				...defGameInfo.eSports,
				icon: "e-sports",
				img: Esports,
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
				...defGameInfo.LIVEcasinoDG,
				img: LIVEcasino_DG
			},
			{
				...defGameInfo.LIVEcasinoPP,
				img: LIVEcasino_PP
			},
			{
				...defGameInfo.LIVEcasinoAE,
				img: LIVEcasino_AE
			},
			{
				...defGameInfo.LIVEcasinoAG,
				img: LIVEcasino_AG
			},
			{
				...defGameInfo.LIVEcasinoAB,
				img: LIVEcasino_AB
			},
			{
				...defGameInfo.LIVEcasinoSA,
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
				...defGameInfo.Casino_ow,
				img: Casino_ow
			},
			{
				...defGameInfo.Casino_PP,
				parameter: { tpId: defGameInfo.Casino_PP.tpId },
				img: Casino_PP
			},
			{
				...defGameInfo.Casino_SG,
				parameter: { tpId: defGameInfo.Casino_SG.tpId },
				img: Casino_SG
			},
			{
				...defGameInfo.Casino_PG,
				parameter: { tpId: defGameInfo.Casino_PG.tpId },
				img: Casino_PG
			},
			{
				...defGameInfo.Casino_JOKER,
				parameter: { tpId: defGameInfo.Casino_JOKER.tpId },
				img: Casino_JOKER
			},
			{
				...defGameInfo.Casino_YGG,
				parameter: { tpId: defGameInfo.Casino_YGG.tpId },
				img: Casino_YGG
			},
			{
				...defGameInfo.Casino_GPI,
				parameter: { tpId: defGameInfo.Casino_GPI.tpId },
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
				...defGameInfo.Fishing,
				icon: "game",
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
				...defGameInfo.Indo4d,
				icon: "lottery",
				img: Id4d,
				spanTextKey: "lbl_Indo4d",
				allowCurrency: [4, 15]
			},
			{
				...defGameInfo.Keno,
				icon: "keno",
				img: Keno,
				spanTextKey: "lbl_Keno"
			},
			{
				...defGameInfo.lottery,
				icon: "lottery",
				img: Lottery,
				spanTextKey: "lbl_Lottery"
			},
			{
				...defGameInfo.NumberGame,
				icon: "lottery",
				img: Number_game,
				spanTextKey: "lbl_NumberGame"
			}
		]
	}
];

export default gameList;
