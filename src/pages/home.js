import React, { useRef, useState, useEffect, useContext } from "react";
import Slider from "../components/home/slider";
import Marquee from "../components/home/marquee";
import Category from "../components/home/category";
import ShortcutBar from "../components/home/shortcutBar";
import {
	i18nContext,
	userInfoContext,
	popBoxContext
} from "../components/common/context";
import { readCookie, setCookie } from "../components/common/common";
import path from "../path";
import { Redirect } from "@reach/router";
import { api_GetWalletInfo } from "../service/api/account";

const IndexPage = () => {
	const _shortcutBar = useRef(null);
	const [shortcutBarLocate, setShortcutBarLocate] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);

	useEffect(() => {
		if (redirectPath !== null) {
			setRedirectPath(null);
		}
	}, [redirectPath]);

	useEffect(() => {
		if (_shortcutBar.current !== null) {
			setShortcutBarLocate(_shortcutBar.current?.getBoundingClientRect());
		}
	}, []);

	useEffect(() => {
		let cookieName = `balanceHint${userInfo.userName}`;
		if (
			userInfo.currencyId &&
			userInfo.userName &&
			readCookie(cookieName) !== "1"
		) {
			setCookie(cookieName, "1", 1);
			api_GetWalletInfo().then(res => {
				if (res.data.errorCode === 0) {
					let data = res.data.data;
					let mainWallet = {
						id: 0,
						displayKey: "lbl_MainWallet",
						balance: data?.balance
					};
					let tpWalletsArr = data?.tpWallets.map(i => {
						return {
							id: i.tpId,
							displayKey: i.displayKey,
							balance: i.balance
						};
					});

					let hasBalance =
						mainWallet.balance ||
						tpWalletsArr?.filter(t => {
							return t.balance > 0;
						}).length >= 1;

					if (!hasBalance) {
						const ClosePopUp = () => {
							setPopBox({
								isOpen: false
							});
						};

						const RedirectToDeposit = () => {
							setRedirectPath(`/${path.deposit.root}`);
							ClosePopUp();
						};

						setPopBox({
							isOpen: true,
							title: i18n.lbl_Notice,
							content: (
								<>
									<p>
										{`${i18n.msg_BalanceHint} : `}
										<span className="important">
											{`${
												i18n[
													`Currency_${userInfo.currencyId}`
												]
											} 0`}
										</span>
									</p>
									<p>{i18n.msg_DepositHint}</p>
								</>
							),
							hasBtn: true,
							btnBar: (
								<div className="btn-group">
									<button
										className="blue"
										onClick={ClosePopUp}>
										{i18n["lbl_Later"]}
									</button>
									<button
										onClick={RedirectToDeposit}
										className="orange">
										{i18n["lbl_DepositNow"]}
									</button>
								</div>
							)
						});
					}
				}
			});
		}
	}, [i18n, setPopBox, userInfo.currencyId, userInfo.userName]);

	return redirectPath !== null ? (
		<Redirect to={redirectPath} noThrow />
	) : (
		<>
			<Slider />
			<Marquee />
			<Category shortcutBarLocate={shortcutBarLocate} />
			<ShortcutBar _ref={_shortcutBar} />
		</>
	);
};

export default IndexPage;
