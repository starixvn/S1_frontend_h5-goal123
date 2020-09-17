import Sport from "../styles/img/sport.jpg";
import Virtual_sports from "../styles/img/virtual_sports.jpg";
import Esports from "../styles/img/e-sports.jpg";
import LIVEcasino_DG from "../styles/img/LIVEcasino_DG.jpg";
import LIVEcasino_PP from "../styles/img/LIVEcasino_PP.jpg";
import LIVEcasino_AE from "../styles/img/LIVEcasino_AE.jpg";
import LIVEcasino_AG from "../styles/img/LIVEcasino_AG.jpg";
import LIVEcasino_AB from "../styles/img/LIVEcasino_AB.jpg";
import LIVEcasino_SA from "../styles/img/LIVEcasino_SA.jpg";
import LIVEcasino_EB from "../styles/img/LIVEcasino_EB.jpg";
import Coming_soon from "../styles/img/coming_soon.jpg";
import Fish from "../styles/img/fish.jpg";
import Keno from "../styles/img/keno.jpg";
import Lottery from "../styles/img/lottery.jpg";
import SabaClub from "../styles/img/saba.jpg";
import Cockfighting from "../styles/img/cockfighting.jpg";
import Casino from "../styles/img/casino.jpg";

export const defGameInfo = {
	Sports: { tpId: 1, gameId: 1 },
	CockFighting: { tpId: 17 },
	VirtualSports: { tpId: 1, gameId: 180 },
	eSports: { tpId: 1, gameId: 43 },
	LIVEcasinoDG: { tpId: 4, gameId: 4 },
	LIVEcasinoPP: { gameId: 101, tpId: 5 },
	LIVEcasinoAE: { gameId: 15, tpId: 15 },
	LIVEcasinoAG: { gameId: 3, tpId: 3 },
	LIVEcasinoAB: { gameId: 12, tpId: 12 },
	LIVEcasinoSA: { gameId: 2, tpId: 2 },
	LIVEcasinoEB: { gameId: 18, tpId: 18 },
	Casino_ow: { gameId: 208, tpId: 1 },
	Casino_All: { tpId: 0 },
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
	NumberGame: { gameId: 161, tpId: 1 },
	sabaClub: {
		tpId: 1,
		gameId: 200
	}
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
		category: "cockFighting",
		categoryIcon: "e-sports",
		translateKey: "lbl_CockFighting",
		items: [
			{
				...defGameInfo.CockFighting,
				icon: "e-sports",
				img: Cockfighting,
				spanTextKey: "lbl_CockFighting"
			}
		]
	},
	{
		category: "game",
		categoryIcon: "game",
		translateKey: "lbl_Games",
		items: [
			{
				...defGameInfo.sabaClub,
				icon: "game",
				img: SabaClub,
				spanTextKey: "lbl_SabaClub"
			},
			{
				...defGameInfo.Fishing,
				icon: "game",
				img: Fish,
				spanTextKey: "lbl_Fishing"
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
			}
		]
	},
	{
		category: "eSports",
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
		category: "slots",
		categoryIcon: "casino",
		translateKey: "lbl_Slots",
		items: [
			{
				...defGameInfo.Casino_All,
				parameter: { tpId: defGameInfo.Casino_All.tpId },
				img: Casino
			}
		]
	},
	{
		category: "livecasino",
		categoryIcon: "livecasino",
		className: "casinoList",
		translateKey: "lbl_LiveCasino",
		comingSoonImg: Coming_soon,
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
			// {
			// 	...defGameInfo.LIVEcasinoEB,
			// 	img: LIVEcasino_EB
			// }
		]
	}
];

export default gameList;
