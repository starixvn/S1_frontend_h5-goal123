import React, { useContext, useState, useEffect, useRef } from "react";
import { Redirect, Link } from "@reach/router";
// import SubMenu from "../subMenu/subMenu";
import {
	userInfoContext,
	i18nContext,
	walletInfoContext,
	popBoxContext,
	msgCountContext
} from "../common/context";
import { api_GetWalletInfo } from "../../service/api/account";
import JoinPanel from "../join/join";
import LoginPanel from "../login/login";
import ReloadSpin from "./reloadSpin";
import { number_format } from "./common";
import path from "../../path";
import Logo from "../../styles/img/logo.png";

const HeaderTitle = ({ title }) => <div className="title">{title}</div>;

const Header = ({ title, hideLogo }) => {
	return (
		<header className={title ? "header" : ""} id="header">
			{hideLogo ? null : (
				<a href="/">
					<img src={Logo} alt="logo" />
				</a>
			)}
			{title ? <HeaderTitle title={title} /> : <HeaderBtn />}
			{/* <SubMenu /> */}
		</header>
	);
};

const HeaderBtn = props => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const { msgCount } = useContext(msgCountContext);
	const { walletInfo, setWalletInfo } = useContext(walletInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const [processing, setProcessing] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin) {
			GetBalance();
		}
	}, [userInfo.isLogin]);

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(null);
		}
	}, [redirectPath, setRedirectPath]);

	const GetBalance = () => {
		if (!processing) {
			setProcessing(true);

			api_GetWalletInfo().then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							let _data = res.data.data;
							let mainWalletBalance = _data.balance;

							let otherWalletBalance = _data.tpWallets?.reduce(
								(prev, curr) => {
									return prev + curr.balance;
								},
								0
							);

							setWalletInfo(prevState => ({
								...prevState,
								allBalance:
									mainWalletBalance + otherWalletBalance
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

	let balance = !walletInfo.allBalance
		? 0
		: number_format(walletInfo.allBalance, false);

	const ClickUserName = () => {
		if (userInfo.isLogin) {
			setRedirectPath(`/${path.member.root}`);
		}
	};

	return redirectPath === null ? (
		userInfo?.isLogin ? (
			<>
				<HeaderInfo
					userName={userInfo?.userName}
					currency={i18n[`Currency_${userInfo.currencyId}`]}
					amount={balance}
					ClickUserName={ClickUserName}
				/>
				<ReloadSpin func={GetBalance} />
				<div className="headerButton">
					<Link to={path.message.root} className="icon icon-chat">
						{msgCount ? (
							<span className="amount">{msgCount}</span>
						) : null}
					</Link>
				</div>
			</>
		) : (
			<div className="headerButton">
				<JoinPanel />
				<LoginPanel ButtonTitle={i18n.lbl_Login} />
			</div>
		)
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};

const HeaderInfo = props => {
	return (
		<div className="headerInfo">
			<div className="MemberID" onClick={props.ClickUserName}>
				{props.userName}
			</div>
			<div className="Balance">
				{props.currency} {props.amount}
			</div>
		</div>
	);
};

export default Header;
