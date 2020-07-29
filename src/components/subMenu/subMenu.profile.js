import React, { useState, useContext, useEffect, useRef } from "react";
import {
	userInfoContext,
	i18nContext,
	walletInfoContext,
	popBoxContext
} from "../common/context";
import LangDropdown from "../common/dropdown.icon";
import { api_GetSiteLangList } from "../../service/api/site";
import { GET_LANG_ID } from "../../service/language";
import { api_SetLanguage, api_GetBalnace } from "../../service/api/account";
import { number_format, isConvert } from "../common/common";
import ReloadSpin from "../common/reloadSpin";

const Profile = () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { walletInfo, setWalletInfo } = useContext(walletInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userLanValue, setUserLanValue] = useState(0);
	const [langList, setLangList] = useState([]);
	const [processing, setProcessing] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_GetSiteLangList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						const langNum = res.data.data;
						let langArr = langNum.map(id => {
							return {
								langId: id.langId,
								displayText: id.language,
								iconClassName: `flag ${id.langId}`
							};
						});
						setLangList(langArr);
					} else {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: res.data.message
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ApiServerError
					});
				}
			}
		);
	}, [i18n.lbl_ImportantNote, i18n.msg_ApiServerError, setPopBox]);

	useEffect(() => {
		let langId = userInfo.langId ?? GET_LANG_ID();
		let idx = langList.findIndex(x => x.langId === langId);
		if (idx !== -1 && isMountedRef.current) {
			setUserLanValue(idx);
		}
	}, [langList, userInfo.langId]);

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

	const selectItemHandler = idx => {
		if (idx !== userLanValue) {
			let langId = langList[idx].langId;
			setUserLanValue(idx);
			if (userInfo.isLogin) {
				api_SetLanguage(langId).then(
					res => {
						if (isMountedRef.current) {
							if (res.data.errorCode === 0) {
								setUserInfo(prevState => ({
									...prevState,
									langId: langId
								}));
							} else {
								setPopBox({
									isOpen: true,
									title: i18n.lbl_ImportantNote,
									content: res.data.message
								});
							}
						}
					},
					err => {
						if (isMountedRef.current) {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: i18n.msg_ApiServerError
							});
						}
					}
				);
			} else {
				setUserInfo(prevState => ({
					...prevState,
					langId: langId
				}));
			}
		}
	};

	let balance = number_format(
		walletInfo.main,
		isConvert(userInfo.currencyId)
	);
	return (
		<div className="info">
			<div className="Avatar"></div>
			<div className="MemberID">
				{i18n.lbl_Welcome} {userInfo?.userName ?? i18n.lbl_Guest}
			</div>
			{userInfo.isLogin ? (
				<Balance
					currency={i18n[`Currency_${userInfo.currencyId}`]}
					amount={balance}
					GetBalance={GetBalance}
				/>
			) : null}

			<div className="Country">
				<i className="icon icon-sphere"></i>
				<LangDropdown
					options={langList}
					mainKey="lang"
					onSelectItem={selectItemHandler}
					selectedIdx={userLanValue}
				/>
			</div>
		</div>
	);
};

const Balance = ({ currency, amount, GetBalance }) => {
	let displayText = `${currency} ${amount}`;
	return (
		<>
			<div className="Balance">
				{displayText}
				<ReloadSpin func={GetBalance} />
			</div>
		</>
	);
};

export default Profile;
