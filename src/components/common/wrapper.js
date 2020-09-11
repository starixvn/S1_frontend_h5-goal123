import React, { useState, useEffect, useRef } from "react";
import * as ct from "../common/context";
import { api_GetCustProfile } from "../../service/api/accountStrict";
import {
	api_GetBalnace,
	api_onlineCheck,
	api_GetMsgCount
} from "../../service/api/account";
import { IS_LOGGED_IN } from "../../service/auth";
import themeList from "../../datas/theme";
import useInterval from "../hook/useInterval";
import { getUrlParameter, setCookie, deleteCookie } from "../common/common";
import i18nConfig from "../../i18n/config";

export const Wrapper = ({ children }) => {
	const [i18n, seti18n] = useState(i18nConfig());

	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		langId: "vn",
		userName: i18n.lbl_Guest
	});
	const [popBox, setPopBox] = useState({
		isOpen: false,
		title: "",
		content: "",
		hasBtn: false,
		btnBar: null
	});
	const [nav, setNav] = useState(null);
	const [walletInfo, setWalletInfo] = useState({
		main: null
	});
	const [msgCount, setMsgCount] = useState(0);
	const [theme, setTheme] = useState(themeList.default);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		let AffId = getUrlParameter("AffId");
		let RefId = getUrlParameter("RefId");
		let Aff = getUrlParameter("Aff");

		if (AffId) {
			setCookie("AffId", AffId, 7);
			deleteCookie("RefId");
			deleteCookie("Aff");
		} else if (RefId) {
			setCookie("RefId", RefId, 7);
			deleteCookie("AffId");
			deleteCookie("Aff");
		} else if (Aff) {
			setCookie("Aff", Aff, 7);
			deleteCookie("AffId");
			deleteCookie("RefId");
		}
	}, []);

	useEffect(() => {
		IS_LOGGED_IN().then(isLogin => {
			if (isLogin !== userInfo.isLogin && isMountedRef.current) {
				setUserInfo(prevState => ({
					...prevState,
					isLogin: isLogin
				}));
			}
		});
	}, [userInfo.isLogin]);

	const OnlineCheckCallBack = (errorCode, errMsg) => {
		const clickClose = () => {
			setPopBox({ isOpen: false });
		};
		if (errorCode !== 0 && isMountedRef.current) {
			setUserInfo(prevState => ({
				isLogin: false,
				langId: prevState.langId
			}));
			setPopBox({
				isOpen: true,
				title: i18n.lbl_ImportantNote,
				content: errMsg ?? i18n.msg_ForceLogedoutHint,
				hasBtn: true,
				btnBar: (
					<div className="btn-group">
						<button className="orange" onClick={clickClose}>
							OK
						</button>
					</div>
				)
			});
		}
	};

	useInterval(
		() => {
			api_onlineCheck().then(
				res => {
					var result = res.data;
					if (
						result.errorCode !== null &&
						result.errorCode !== 0 &&
						isMountedRef.current
					) {
						OnlineCheckCallBack(result.errorCode, result.message);
					}
				},
				error => {
					if (
						error.response !== null &&
						error.response.status === 401 &&
						isMountedRef.current
					) {
						OnlineCheckCallBack(error.response.status);
					}
				}
			);
		},
		userInfo.isLogin ? 10000 : null
	);

	useEffect(() => {
		if (userInfo.isLogin) {
			if (!userInfo.regTime) {
				api_GetCustProfile().then(res_custInfo => {
					if (
						res_custInfo.data.errorCode === 0 &&
						isMountedRef.current
					) {
						let data = res_custInfo.data.data;
						setUserInfo(prevState => ({
							...prevState,
							...data
						}));
					}
				});
			}

			api_GetMsgCount().then(res => {
				if (res.data.errorCode === 0 && isMountedRef.current) {
					setMsgCount(res.data.data);
				}
			});

			if (userInfo.userName) {
				api_GetBalnace().then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						setWalletInfo(prevState => ({
							...prevState,
							main: res.data.data
						}));
					}
				});
			}
		} else if (isMountedRef.current) {
			setMsgCount(0);
		}
	}, [userInfo.isLogin, userInfo.regTime, userInfo.userName, i18n]);

	useEffect(() => {
		seti18n(i18nConfig(userInfo.langId));
	}, [userInfo.langId]);

	return (
		<ct.userInfoContext.Provider value={{ userInfo, setUserInfo }}>
			<ct.i18nContext.Provider value={{ i18n, seti18n }}>
				<ct.walletInfoContext.Provider
					value={{ walletInfo, setWalletInfo }}>
					<ct.themeContext.Provider value={{ theme, setTheme }}>
						<ct.popBoxContext.Provider
							value={{ popBox, setPopBox }}>
							<ct.navContext.Provider value={{ nav, setNav }}>
								<ct.msgCountContext.Provider
									value={{ msgCount, setMsgCount }}>
									{children}
								</ct.msgCountContext.Provider>
							</ct.navContext.Provider>
						</ct.popBoxContext.Provider>
					</ct.themeContext.Provider>
				</ct.walletInfoContext.Provider>
			</ct.i18nContext.Provider>
		</ct.userInfoContext.Provider>
	);
};
