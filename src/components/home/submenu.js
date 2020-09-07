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
		displayKey: "lbl_Home",
		path: "/",
		icon: "icon icon-home"
	},
	{
		...defGameInfo.Sports,
		displayKey: "lbl_Sports",
		icon: "icon icon-sports"
	},
	{
		...defGameInfo.eSports,
		displayKey: "lbl_eSports",
		icon: "icon icon-e-sports"
	},
	{
		displayKey: "lbl_Slots",
		path: `/${path.casino.root}`,
		icon: "icon icon-e-sports"
	},
	{
		displayKey: "lbl_LiveCasino",
		path: `/`,
		icon: "icon icon-livecasino"
	},
	{
		displayKey: "lbl_Promotions",
		path: `/${path.promotion.root}`,
		icon: "icon icon-livecasino"
	}
];

export default () => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);

	const { nav, setNav } = useContext(navContext);

	const closeNavPanel = () => {
		setNav(() => null);
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
			/>
		</div>
	);
};

const SubMenuList = ({ i18n, userInfo, setNav, closeNavPanel }) => {
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
		if (s.path) {
			return (
				<Link
					to={s.path}
					onClick={closeNavPanel}
					key={key}
					className={s.icon}>
					{i18n[s.displayKey]}
				</Link>
			);
		} else {
			return (
				<button
					key={key}
					onClick={clickGame.bind(this, s)}
					className={s.icon}>
					{i18n[s.displayKey]}
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

	let balance = number_format(
		walletInfo.main,
		isConvert(userInfo.currencyId)
	);

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
