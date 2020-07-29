import path from "../path";
import gamePic1 from "../styles/img/gamePic1.jpg";
import gamePic2 from "../styles/img/gamePic2.jpg";
import gamePic3 from "../styles/img/gamePic3.jpg";
import gamePic4 from "../styles/img/gamePic4.jpg";
import gamePic6 from "../styles/img/gamePic6.jpg";
import gamePic7 from "../styles/img/gamePic7.jpg";
import gamePic9 from "../styles/img/gamePic9.jpg";
import LIVEcasino_PP from "../styles/img/LIVEcasino_PP.jpg";
import LIVEcasino_AG from "../styles/img/LIVEcasino_AG.jpg";
import LIVEcasino_DG from "../styles/img/LIVEcasino_DG.jpg";
import LIVEcasino_SA from "../styles/img/LIVEcasino_SA.jpg";
import LIVEcasino_AB from "../styles/img/LIVEcasino_AB.jpg";
import casinoNOVA from "../styles/img/casinoNOVA.jpg";
import casinoOW from "../styles/img/casinoOW.jpg";
import keno from "../styles/img/keno.jpg";
import lottery from "../styles/img/lottery.jpg";

const gameList = [
	{
		category: "sports",
		items: [
			{
				icon: "soccer",
				gameId: 1,
				tpId: 1,
				imgId: gamePic1,
				translation: "lbl_Soccer"
			},
			{
				icon: "baseball",
				gameId: 8,
				tpId: 1,
				imgId: gamePic2,
				translation: "lbl_Soccer"
			},
			{
				icon: "basketball",
				gameId: 2,
				tpId: 1,
				imgId: gamePic3,
				translation: "lbl_Basketball"
			},
			{
				icon: "badminton",
				gameId: 9,
				tpId: 1,
				imgId: gamePic4,
				translation: "lbl_badminton"
			},
			{
				icon: "football",
				gameId: 3,
				tpId: 1,
				imgId: gamePic7,
				translation: "lbl_Football"
			},
			{
				icon: "hockey",
				gameId: 4,
				tpId: 1,
				imgId: gamePic9,
				translation: "lbl_Hockey"
			},
			{
				icon: "tennis",
				gameId: 5,
				tpId: 1,
				imgId: gamePic6,
				translation: "lbl_Tennis"
			}
		],
		translation: "lbl_Sports"
	},
	{
		category: "virtualsports",
		items: [],
		_blank: true,
		translation: "lbl_eSports",
		gameId: 43,
		tpId: 1
	},
	{
		category: "livecasino",
		items: [
			{
				icon: "PP",
				gameId: 101,
				tpId: 5,
				imgId: LIVEcasino_PP,
				span: "PP",
				translation: "lbl_PPCasino"
			},
			{
				icon: "AG",
				gameId: 3,
				tpId: 3,
				imgId: LIVEcasino_AG,
				span: "AG",
				translation: "lbl_AGCasino"
			},
			{
				icon: "DG",
				gameId: 4,
				tpId: 4,
				imgId: LIVEcasino_DG,
				span: "DG",
				translation: "lbl_DGCasino"
			},
			{
				icon: "SA",
				gameId: 2,
				tpId: 2,
				imgId: LIVEcasino_SA,
				span: "SA",
				translation: "lbl_SACasino"
			},
			{
				icon: "AB",
				gameId: 12,
				tpId: 12,
				imgId: LIVEcasino_AB,
				span: "AB",
				translation: "lbl_ABCasino"
			}
		],
		translation: "lbl_LiveCasino"
	},
	{
		category: "casino",
		items: [
			{
				icon: "nova-casino",
				path: path.casino.root,
				imgId: casinoNOVA,
				span: "NOVA CASINO",
				translation: "lbl_SelfCasino"
			},
			{
				icon: "ow-casino",
				gameId: 1,
				tpId: 208,
				imgId: casinoOW,
				span: "OW CASINO",
				translation: "lbl_OWCasino"
			}
		],
		translation: "lbl_Casino"
	},
	{
		category: "game",
		items: [],
		_blank: true,
		translation: "lbl_Fishing",
		gameId: 10,
		tpId: 7,
		gameType: "Fishing"
	},
	{
		category: "kelo",
		items: [
			{
				icon: "keno",
				gameId: 202,
				tpId: 1,
				imgId: keno,
				span: "KENO",
				translation: "lbl_Keno"
			},
			{
				icon: "lottery",
				gameId: 220,
				tpId: 1,
				imgId: lottery,
				span: "LOTTERY",
				translation: "lbl_Lottery"
			}
		],
		translation: "lbl_KenoAndLottery"
	}
];

export default gameList;
