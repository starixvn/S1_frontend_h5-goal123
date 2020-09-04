// import React, { useContext } from "react";
// import Profile from "./subMenu.profile";
// import {
// 	navContext,
// 	defNavPanel,
// 	i18nContext,
// 	userInfoContext,
// 	msgCountContext
// } from "../common/context";
// import SubGameList from "./subMenu.gameList";
// import { Link } from "@reach/router";
// import path from "../../path";

// const SubMenu = () => {
// 	const { userInfo } = useContext(userInfoContext);
// 	const { nav, setNav } = useContext(navContext);
// 	const { i18n } = useContext(i18nContext);
// 	const { msgCount } = useContext(msgCountContext);

// 	const handleOpen = () => {
// 		setNav(prevState => {
// 			let newState =
// 				prevState === defNavPanel.subMenu ? null : defNavPanel.subMenu;
// 			return newState;
// 		});
// 	};

// 	let isOpen = nav === defNavPanel.subMenu;

// 	const ClickMenuItem = (needLogin, isLogin) => {
// 		let panel = needLogin && isLogin === false ? defNavPanel.login : null;
// 		setNav(panel);
// 	};

// 	const ShowLogin = () => {
// 		setNav(defNavPanel.login);
// 	};

// 	const NavLink = props => {
// 		let { checkProfile, redirectPath, ...passProps } = props;
// 		if (userInfo.isLogin === false) {
// 			passProps = { ...passProps, to: "/", onClick: ShowLogin };
// 		}

// 		return <Link {...passProps} />;
// 	};

// 	return (
// 		<>
// 			<div
// 				className={`close${isOpen ? " open" : ""}`}
// 				onClick={handleOpen}>
// 				<span></span>
// 				<span></span>
// 				<span></span>
// 				<span></span>
// 				<span></span>
// 				<span></span>
// 			</div>

// 			<div className={`subMenu${isOpen ? " open" : ""}`}>
// 				<Profile />
// 				<div className="subThBar">
// 					<NavLink
// 						to={path.deposit.root}
// 						className="icon icon-deposit"
// 						checkProfile={true}
// 						redirectPath={path.member.root}
// 						onClick={ClickMenuItem.bind(
// 							this,
// 							true,
// 							userInfo.isLogin
// 						)}>
// 						<span>{i18n.lbl_Deposit}</span>
// 					</NavLink>
// 					<Link
// 						to={path.transfer.root}
// 						className="icon icon-transfer"
// 						onClick={ClickMenuItem.bind(
// 							this,
// 							true,
// 							userInfo.isLogin
// 						)}>
// 						<span>{i18n["lbl_Transfer"]}</span>
// 					</Link>
// 					<NavLink
// 						to={path.withdrawal.root}
// 						className="icon icon-withdrawal"
// 						checkProfile={true}
// 						redirectPath={path.member.root}
// 						onClick={ClickMenuItem.bind(
// 							this,
// 							true,
// 							userInfo.isLogin
// 						)}>
// 						<span>{i18n.lbl_Withdrawal}</span>
// 					</NavLink>
// 				</div>
// 				<SubGameList />
// 				<div className="memberFunction">
// 					<Link
// 						to={path.member.root}
// 						className="icon icon-member"
// 						onClick={ClickMenuItem.bind(
// 							this,
// 							true,
// 							userInfo.isLogin
// 						)}>
// 						{i18n.lbl_Me}
// 					</Link>
// 					<Link
// 						to={path.statement.root}
// 						className="icon icon-history"
// 						onClick={ClickMenuItem.bind(
// 							this,
// 							true,
// 							userInfo.isLogin
// 						)}>
// 						{i18n.lbl_Statement}
// 					</Link>
// 					<Link
// 						to={path.message.root}
// 						className="icon icon-email"
// 						onClick={ClickMenuItem.bind(
// 							this,
// 							true,
// 							userInfo.isLogin
// 						)}>
// 						<span>{i18n.lbl_Message}</span>
// 						{msgCount ? (
// 							<span className="amount">{msgCount}</span>
// 						) : null}
// 					</Link>
// 					{userInfo.isLogin ? (
// 						<a className="icon icon-vip">
// 							<span>VIP Lv{userInfo.userLevel}</span>
// 						</a>
// 					) : null}
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default SubMenu;
