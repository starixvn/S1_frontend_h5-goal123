import React, { useContext } from "react";
import {
	i18nContext,
	navContext,
	defNavPanel,
	userInfoContext
} from "../common/context";
import { Link } from "@reach/router";
import path from "../../path";

const ShortcutBar = props => {
	const { i18n } = useContext(i18nContext);
	const { setNav } = useContext(navContext);
	const { userInfo } = useContext(userInfoContext);

	const ShowLogin = () => {
		setNav(defNavPanel.login);
	};

	const NavLink = props => {
		let { checkProfile, redirectPath, checkBankInfo, ...passProps } = props;
		if (userInfo.isLogin === false) {
			passProps = { ...passProps, to: "/", onClick: ShowLogin };
		}

		return <Link {...passProps} />;
	};

	return (
		<div className="thBar" ref={props._ref}>
			<NavLink
				to={`/${path.deposit.root}`}
				className="icon icon-deposit"
				checkProfile={true}>
				<span>{i18n.lbl_Deposit}</span>
			</NavLink>
			<NavLink
				to={`/${path.transfer.root}`}
				className="icon icon-transfer">
				<span>{i18n.lbl_Transfer}</span>
			</NavLink>
			<NavLink
				to={`/${path.withdrawal.root}`}
				className="icon icon-withdrawal"
				checkProfile={true}>
				<span>{i18n.lbl_Withdrawal}</span>
			</NavLink>
		</div>
	);
};

export default ShortcutBar;
