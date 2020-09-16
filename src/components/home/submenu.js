import React, { useContext, useState, useRef, useEffect } from "react";
import Logo from "../../styles/img/logo.png";
import {
	userInfoContext,
	i18nContext,
	popBoxContext,
	walletInfoContext,
	navContext,
	defNavPanel
} from "../common/context";
import { Link } from "@reach/router";
import path from "../../path";
import { api_GetBalnace } from "../../service/api/account";
import { isConvert, number_format } from "../common/common";
import ReloadSpin from "../common/reloadSpin";
import { defGameInfo } from "../../datas/productList";
import { GET_ENTER_PAGE } from "../../service/enterPage";
import ShortcutBar from "./shortcutBar";

const defSubMenus = [
	{
		...defGameInfo.Sports,
		displayKey: "lbl_Sports",
		icon: "icon icon-sports"
	},
	{
		...defGameInfo.CockFighting,
		displayKey: "lbl_CockFighting",
		icon: "icon icon-cock"
	},
	{
		displayKey: "lbl_Games",
		icon: "icon icon-kelo",
		subItems: [
			{
				...defGameInfo.sabaClub,
				displayKey: "lbl_SabaClub"
			},
			{
				...defGameInfo.Fishing,
				displayKey: "lbl_Fishing"
			},
			{
				...defGameInfo.Keno,
				displayKey: "lbl_Keno"
			},
			{
				...defGameInfo.lottery,
				displayKey: "lbl_Lottery"
			}
		]
	},
	{
		...defGameInfo.eSports,
		displayKey: "lbl_eSports",
		icon: "icon icon-e-sports"
	},
	{
		displayKey: "lbl_Slots",
		path: `/${path.casino.root}`,
		icon: "icon icon-casino"
	},
	{
		displayKey: "lbl_LiveCasino",
		icon: "icon icon-livecasino",
		subItems: [
			{
				...defGameInfo.LIVEcasinoDG,
				displayKey: "DG"
			},
			{
				...defGameInfo.LIVEcasinoAB,
				displayKey: "AB"
			},
			{
				...defGameInfo.LIVEcasinoAG,
				displayKey: "AG"
			},
			{
				...defGameInfo.LIVEcasinoPP,
				displayKey: "PP"
			},
			{
				...defGameInfo.LIVEcasinoSA,
				displayKey: "SA"
			},
			{
				...defGameInfo.LIVEcasinoAE,
				displayKey: "AE"
			}
		]
	},
	{
		displayKey: "lbl_Promotions",
		path: `/${path.promotion.root}`,
		icon: "icon icon-gift"
	}
];

export default () => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const { nav, setNav } = useContext(navContext);
	const [isOpenSubMenu, setIsOpenSubMenu] = useState([]);

	const handleSubMenu = displayKey => {
		if (isOpenSubMenu.includes(displayKey)) {
			setIsOpenSubMenu(prevS => prevS.filter(s => s !== displayKey));
		} else {
			setIsOpenSubMenu(prevS => [...prevS, displayKey]);
		}
	};

	const closeNavPanel = () => {
		setNav(() => null);
		setIsOpenSubMenu([]);
	};

	let openPanel = nav === defNavPanel.subMenu;

	return (
		<div className={`submenu${openPanel ? " open" : ""}`}>
			<div className="close open" onClick={closeNavPanel}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<img src={Logo} alt="Goal123" />
			{userInfo.isLogin ? (
				<>
					<WalletInfo i18n={i18n} userInfo={userInfo} />
					<ShortcutBar />
				</>
			) : null}
			<SubMenuList
				i18n={i18n}
				userInfo={userInfo}
				setNav={setNav}
				closeNavPanel={closeNavPanel}
				handleSubMenu={handleSubMenu}
				isOpenSubMenu={isOpenSubMenu}
			/>
		</div>
	);
};

const SubMenuList = ({
	i18n,
	userInfo,
	setNav,
	closeNavPanel,
	handleSubMenu,
	isOpenSubMenu
}) => {
	const clickGame = ({ tpId, gameId }) => {
		GET_ENTER_PAGE({
			langId: userInfo.langId,
			tpId,
			gameId,
			isLogin: userInfo.isLogin === true,
			loginCallback: () => {
				setNav(defNavPanel.login);
			}
		});
	};

	let rows = defSubMenus.map(s => {
		let key = `submenu-${s.displayKey}`;
		let hasSubItem = false;
		let _subItems = null;
		if (s.subItems) {
			let subItemContent = s.subItems?.map(c => {
				return (
					<li
						key={`${key}-${c.displayKey}`}
						onClick={clickGame.bind(this, c)}>
						<button>
							{i18n[c.displayKey] ?? c.displayKey}
							{_subItems}
						</button>
					</li>
				);
			});

			hasSubItem = subItemContent.length > 0;
			if (hasSubItem) {
				let isOpen = isOpenSubMenu.includes(s.displayKey);
				_subItems = (
					<>
						<i
							className={`icon icon-keyboard_arrow_right1${
								isOpen ? " open" : ""
							}`}></i>
						<ul className={isOpen ? "open" : ""}>
							{subItemContent}
						</ul>
					</>
				);
			}
		}

		if (s.path) {
			return (
				<Link
					to={s.path}
					onClick={closeNavPanel}
					key={key}
					className={s.icon}>
					{i18n[s.displayKey] ?? s.displayKey}
					{_subItems}
				</Link>
			);
		} else {
			return hasSubItem ? (
				<div
					key={key}
					onClick={handleSubMenu.bind(this, s.displayKey)}
					className={s.icon}>
					{i18n[s.displayKey] ?? s.displayKey}
					{_subItems}
				</div>
			) : (
				<button
					key={key}
					onClick={clickGame.bind(this, s)}
					className={s.icon}>
					{i18n[s.displayKey] ?? s.displayKey}
				</button>
			);
		}
	});

	return <div className="side-nav">{rows}</div>;
};

const WalletInfo = ({ i18n, userInfo }) => {
	const { setPopBox } = useContext(popBoxContext);
	const { walletInfo, setWalletInfo } = useContext(walletInfoContext);
	const [processing, setProcessing] = useState(false);

	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const GetBalance = () => {
		if (!processing) {
			setProcessing(true);

			api_GetBalnace().then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setWalletInfo(prevState => ({
								...prevState,
								main: res.data.data
							}));
						} else {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message
							});
						}
						setProcessing(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: i18n.msg_ApiServerError
						});
						setProcessing(false);
					}
				}
			);
		}
	};

	let balance = number_format(walletInfo.main, false);

	return (
		<div className="side-info">
			<div>
				{i18n.lbl_Welcome} {userInfo.userName}
			</div>
			<div>
				<span>{i18n[`Currency_${userInfo.currencyId}`]}</span>
				{balance}
				<ReloadSpin func={GetBalance} />
			</div>
		</div>
	);
};
