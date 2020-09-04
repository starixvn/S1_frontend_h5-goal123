import React, { useState, useEffect, useRef } from "react";
import * as ct from "../common/context";
import { api_GetTranslationData } from "../../service/api/site";
import { api_GetCustProfile } from "../../service/api/accountStrict";
import {
	api_GetBalnace,
	api_onlineCheck,
	api_GetMsgCount
} from "../../service/api/account";
import { IS_LOGGED_IN } from "../../service/auth";
import { GET_LANG_ID } from "../../service/language";
import themeList from "../../datas/theme";
import useInterval from "../hook/useInterval";
import { getUrlParameter, setCookie, deleteCookie } from "../common/common";
import i18nDefault from "../../datas/i18nDefault";

export const Wrapper = ({ children }) => {
	const [i18n, seti18n] = useState(i18nDefault);

	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		langId: GET_LANG_ID(),
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
	const [theme, setTheme] = useState(themeList.dark);

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
		if (errorCode !== 0 && isMountedRef.current) {
			setUserInfo(prevState => ({
				isLogin: false,
				langId: prevState.langId
			}));
			setPopBox({
				isOpen: true,
				title: i18n.lbl_ImportantNote,
				content: errMsg ?? i18n.msg_ForceLogedoutHint
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
		api_GetTranslationData(userInfo.langId).then(
			res => {
				if (isMountedRef.current) {
					seti18n(prevState => ({ ...prevState, ...res.data.data }));
				}
			},
			err => {
				if (err.response) {
					console.log("error status", err.response.status);
				} else {
					console.log("error", err);
				}
			}
		);
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
