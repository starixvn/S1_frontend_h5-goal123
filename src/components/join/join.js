import React, { useEffect, useState, useContext, useRef } from "react";
import Inputbox from "../common/inputbox";
import InputboxPWD from "../common/inputbox.password";
import Dropdown from "../common/dropdown";
import Checkbox from "../common/checkbox";
import Tips from "./tips";
import logo from "../../styles/img/logo.png";
import {
	api_ExistsUserName,
	api_ExistsEmail,
	api_Register,
	api_GetSiteCurrencyList,
	api_GetBanner
} from "../../service/api/site";
import { api_GetCustProfile } from "../../service/api/accountStrict";
import { getUrlParameter } from "../common/common";
import { getCookie } from "../common/cookie";
import {
	userInfoContext,
	i18nContext,
	navContext,
	defNavPanel,
	popBoxContext
} from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import TandC from "../../service/t_and_c";
import { useMatch, Redirect } from "@reach/router";
import path from "../../path";
import config from "../../config";
import PromoPopup from "./join.promotion";

const colName = ["UserName", "Password", "Email", "Currency"];

const initState = {
	UserName: "",
	Password: "",
	Email: "",
	Currency: null,
	Checkbox: false
};

const initWarningState = {
	UserName: {
		status: false,
		msg: ""
	},
	Password: {
		status: false,
		msg: ""
	},
	Email: {
		status: false,
		msg: ""
	},
	Currency: {
		status: false
	},
	Checkbox: {
		status: false,
		msg: ""
	}
};

const initChecklistState = {
	UserName: false,
	Password: false,
	Email: false,
	Checkbox: false
};

const defaultLangId = GET_LANG_ID();
const currencyDefaultSelectIdx = 0;

const Join = () => {
	const { i18n } = useContext(i18nContext);
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { nav, setNav } = useContext(navContext);
	const [userValueState, setUserValueState] = useState(initState);
	const [siteCurrencyState, setSiteCurrencyState] = useState([]);
	const [warningState, setWarningState] = useState(initWarningState);
	const [pswState, setPswState] = useState(false);
	const [checkboxState, setCheckboxState] = useState(false);
	const [redirectPath, setRedirectPath] = useState(null);
	const [banner, setBanner] = useState([]);

	const [hideCurrency, setHideCurrency] = useState(false);

	const [showTipsState, setShowTipsState] = useState({
		UserName: false,
		Password: false,
		Email: false,
		Currency: false
	});

	const [checklistState, setChecklistState] = useState(initChecklistState);
	const [promoPopup, setPromoPopup] = useState(false);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		let refId = getCookie("RefId");
		let showBylink = window.location.pathname === `/${path.join.root}`;
		let openPanel = showBylink || nav === defNavPanel.join;
		if (refId && openPanel) {
			api_GetBanner("Promotion", refId, userInfo.langId).then(res => {
				if (res.data.errorCode === 0 && isMountedRef.current) {
					if (res.data.data.length > 0) {
						setBanner(res.data.data);
						setPromoPopup(true);
					}
				}
			});
		}
	}, [nav, userInfo.langId]);

	useEffect(() => {
		let AffId = getUrlParameter("AffId") || getCookie("AffId");
		if (AffId && isMountedRef) {
			setHideCurrency(true);
		}
	}, []);

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(null);
		}
	}, [redirectPath]);

	useEffect(() => {
		api_GetSiteCurrencyList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						const currencyNum = res.data.data;
						let currencyArr = currencyNum.map(id => {
							return { id: id, displayKey: `Currency_${id}` };
						});
						setUserValueState(prevState => ({
							...prevState,
							Currency: currencyArr[currencyDefaultSelectIdx]
						}));
						setSiteCurrencyState(() => currencyArr);
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

	const showPswHandler = () => {
		setPswState(!pswState);
	};

	const showTipsHandler = col => {
		if (warningState[col].status === true) {
			setShowTipsState(prevState => {
				Object.keys(prevState).forEach(_col => {
					prevState[_col] = false;
				});
				return {
					...prevState
				};
			});
		} else {
			setShowTipsState(prevState => {
				Object.keys(prevState).forEach(_col => {
					prevState[_col] = _col === col;
				});
				return {
					...prevState
				};
			});
		}
	};

	const usernameCheck = val => {
		let checked = false;
		let message = "";
		if (val === "") {
			checked = false;
			message = i18n["msg_UsernameReq"];
		} else if (val != null) {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				message = i18n["msg_UsernameLength"];
			} else {
				checked = true;
			}
		}

		return { checked, message };
	};

	const checkUsernameHandler = (colName, e) => {
		const val = e.target.value;
		let result = usernameCheck(val);

		if (val !== "") {
			if (result.checked) {
				setWarningState(prevState => {
					return {
						...prevState,
						[colName]: {
							status: false,
							msg: ""
						}
					};
				});
				api_ExistsUserName({
					UserName: val
				}).then(
					response => {
						if (isMountedRef.current) {
							const res = response.data;
							if (res.errorCode === 0) {
								if (res.data === true) {
									setWarningState(prevState => {
										return {
											...prevState,
											UserName: {
												status: true,
												msg:
													i18n.msg_UsernameNotAvailable
											}
										};
									});
								} else {
									setShowTipsState(prevState => {
										return {
											...prevState,
											UserName: false
										};
									});
									setChecklistState(prevState => {
										return {
											...prevState,
											UserName: result.checked
										};
									});
								}
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
				setShowTipsState(prevState => {
					return { ...prevState, UserName: false };
				});
				setWarningState(prevState => {
					return {
						...prevState,
						[colName]: {
							status: !result.checked,
							msg: result.message
						}
					};
				});
			}
		}
	};

	const passwordCheck = val => {
		let checked = false;
		let message = "";

		const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;
		if (val === "") {
			checked = false;
			message = i18n["msg_PasswordReq"];
		} else if (val != null) {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				message = i18n["msg_PasswordLength"];
			} else if (!regx.test(val)) {
				checked = false;
				message = i18n["msg_PasswordVaildate"];
			} else {
				checked = true;
			}
		}
		return { checked, message };
	};

	const checkPasswordHandler = (colName, e) => {
		const val = e.target.value;

		let result = passwordCheck(val);
		setWarningState(prevState => {
			return {
				...prevState,
				[colName]: {
					status: !result.checked,
					msg: result.message
				}
			};
		});
		setShowTipsState(prevState => {
			return { ...prevState, Password: false };
		});
		setUserValueState(prevState => {
			return { ...prevState, Password: val };
		});
		setChecklistState(prevState => {
			return { ...prevState, Password: result.checked };
		});
	};

	const emailCheck = val => {
		let checked = false;
		let message = "";
		const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (val === "") {
			checked = false;
			message = i18n["msg_MailWrongFormat"];
		} else if (val != null) {
			if (!regx.test(val)) {
				checked = false;
				message = i18n["msg_MailWrongFormat"];
			} else {
				checked = true;
			}
		}

		return { checked, message };
	};

	const checkEmailHandler = (colName, e) => {
		const val = e.target.value;

		let result = emailCheck(val);
		if (val !== "") {
			if (result.checked) {
				setWarningState(prevState => {
					return {
						...prevState,
						[colName]: {
							status: false,
							msg: ""
						}
					};
				});
				api_ExistsEmail({
					Email: val
				}).then(
					response => {
						if (isMountedRef.current) {
							const res = response.data;
							if (res.errorCode === 0) {
								if (res.data === true) {
									setShowTipsState(prevState => {
										return { ...prevState, Email: false };
									});
									setWarningState(prevState => {
										return {
											...prevState,
											Email: {
												status: true,
												msg: i18n["msg_MailExisted"]
											}
										};
									});
								} else {
									setChecklistState(prevState => {
										return {
											...prevState,
											Email: result.checked
										};
									});
								}
							} else {
								setPopBox({
									isOpen: true,
									title: i18n.lbl_ImportantNote,
									content: response.data.message
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
				setShowTipsState(prevState => {
					return { ...prevState, Email: false };
				});
				setWarningState(prevState => {
					return {
						...prevState,
						[colName]: {
							status: !result.checked,
							msg: result.message
						}
					};
				});
			}
		}
	};

	const [currencyState, setcurrencyState] = useState(
		currencyDefaultSelectIdx
	);

	const dropdownStateHandler = i => {
		setcurrencyState(i);
		setShowTipsState(prevState => {
			return { ...prevState, Currency: false };
		});
		setUserValueState(prevState => {
			return { ...prevState, Currency: siteCurrencyState[i] };
		});
	};

	const EditField = (colName, e) => {
		let val = e.target.value;
		setUserValueState(prevState => ({
			...prevState,
			[colName]: val
		}));
	};

	const checkboxHandler = () => {
		let checked = !checkboxState;
		setCheckboxState(checked);
		setChecklistState(prevState => {
			return { ...prevState, Checkbox: checked };
		});
		setUserValueState(prevState => ({
			...prevState,
			Checkbox: checked
		}));
		setWarningState(prevState => {
			return {
				...prevState,
				Checkbox: {
					status: !checked,
					msg: i18n.lbl_Check18TCTooltip
				}
			};
		});
	};

	const checklistHandler = () => {
		let checked = true;

		let UserName = usernameCheck(userValueState.UserName);
		let Password = passwordCheck(userValueState.Password);
		let Email = emailCheck(userValueState.Email);
		let Checkbox = checkboxState;

		checked =
			UserName.checked && Password.checked && Email.checked && Checkbox;

		for (let i in checklistState) {
			if (checklistState[i] === false) {
				checked = false;
				setWarningState(prevState => {
					return {
						...prevState,
						[i]: {
							status: true,
							msg: i.message
						}
					};
				});
			}
		}

		if (checked) {
			let regData = {
				UserName: userValueState.UserName,
				Userpwd: userValueState.Password,
				Email: userValueState.Email,
				CurrencyId: userValueState.Currency.id,
				UserLang: defaultLangId
			};

			regData["RefId"] = getUrlParameter("RefId") || getCookie("RefId");
			regData["AffId"] = getUrlParameter("AffId") || getCookie("AffId");
			regData["Aff"] = getUrlParameter("Aff") || getCookie("Aff");

			api_Register(regData).then(
				response => {
					if (isMountedRef.current) {
						const errorCode = response.data.errorCode;
						const message = response.data.message;
						if (errorCode === 0) {
							api_GetCustProfile().then(
								res_custInfo => {
									if (isMountedRef.current) {
										let _user = {
											isLogin: true,
											langId: defaultLangId,
											userName: userValueState.UserName
										};
										if (res_custInfo.data.errorCode === 0) {
											_user = {
												..._user,
												...res_custInfo.data.data
											};
										}
										setUserInfo(_user);
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
							setNav(null);
						} else if (
							errorCode === -2 ||
							errorCode === -5 ||
							errorCode === -19
						) {
							setWarningState(prevState => ({
								...prevState,
								UserName: { status: true, msg: message }
							}));
						} else if (errorCode === -3) {
							setWarningState(prevState => ({
								...prevState,
								Password: { status: true, msg: message }
							}));
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
			setWarningState(prevState => ({
				...prevState,
				UserName: { status: !UserName.checked, msg: UserName.message },
				Password: { status: !Password.checked, msg: Password.message },
				Email: { status: !Email.checked, msg: Email.message }
			}));
		}
	};

	const handleJoinPanel = (show, reset, showBylink) => {
		if (reset) {
			setUserValueState({
				...initState,
				Currency: siteCurrencyState[currencyDefaultSelectIdx]
			});
			setWarningState(initWarningState);
			setcurrencyState(currencyDefaultSelectIdx);
			setCheckboxState(false);
			setChecklistState(initChecklistState);
		}

		if (showBylink) {
			setRedirectPath("/");
		} else {
			setNav(() => {
				let newState = show ? null : defNavPanel.join;
				return newState;
			});
		}
	};

	let showBylink = useMatch(path.join.root);
	let openPanel = showBylink || nav === defNavPanel.join;

	const ClosePromoPopup = () => {
		setPromoPopup(false);
	};

	return redirectPath === null ? (
		<>
			<button onClick={handleJoinPanel.bind(this, openPanel)}>
				{i18n.lbl_JoinNow}
			</button>
			<div className={`Join${openPanel ? " open" : ""}`}>
				<div
					className={`close${openPanel ? " open" : ""}`}
					onClick={handleJoinPanel.bind(
						this,
						openPanel,
						true,
						showBylink
					)}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<img src={logo} alt="" />
				<div className="title">{i18n.lbl_JoinNow}</div>

				<Inputbox
					icon="icon-member"
					inputType="text"
					placeholder={i18n["lbl_Username"]}
					onFocus={showTipsHandler.bind(null, "UserName")}
					onBlur={checkUsernameHandler.bind(null, "UserName")}
					onChange={EditField.bind(null, "UserName")}
					ClassName="JoinRule"
					showTips={showTipsState.UserName}
					Tips={i18n["lbl_UsernameTooltip"]}
					Warning={warningState.UserName}
					value={userValueState.UserName}></Inputbox>

				<InputboxPWD
					icon="icon-key"
					inputType={`${!pswState ? "password" : "text"}`}
					placeholder={i18n["lbl_Password"]}
					onFocus={showTipsHandler.bind(null, "Password")}
					onBlur={checkPasswordHandler.bind(null, "Password")}
					onChange={EditField.bind(null, "Password")}
					showPsw={pswState}
					showPswHandler={showPswHandler}
					ClassName="JoinRule"
					showTips={showTipsState.Password}
					Tips={i18n["lbl_PasswordTooltip"]}
					Warning={warningState.Password}
					value={userValueState.Password}></InputboxPWD>

				<Inputbox
					icon="icon-email"
					inputType="text"
					placeholder={i18n["lbl_Email"]}
					onFocus={showTipsHandler.bind(null, "Email")}
					onBlur={checkEmailHandler.bind(null, "Email")}
					onChange={EditField.bind(null, "Email")}
					ClassName="JoinRule"
					showTips={showTipsState.Email}
					Tips={i18n["lbl_EmailToolTip"]}
					Warning={warningState.Email}
					value={userValueState.Email}></Inputbox>

				{hideCurrency ? null : (
					<div className="inputBox">
						<Dropdown
							mainKey="join-curr"
							colName={colName[3]}
							selectedIdx={currencyState}
							options={siteCurrencyState}
							clickDropdown={showTipsHandler}
							onSelectItem={dropdownStateHandler}
							value={userValueState.Currency}
							i18n={i18n}></Dropdown>
						<Tips
							Icon="icon-coin-dollar"
							IsOpen={showTipsState.Currency}
							ClassName="JoinRule">
							{i18n["lbl_PreferredCurrencyToolTip"]}
						</Tips>
					</div>
				)}

				<Checkbox
					Checked={checkboxState}
					className={`Terms${
						warningState.Checkbox.status ? " error" : ""
					}`}
					checkboxHandler={checkboxHandler}
					id="c1">
					{i18n["lbl_Check18TC1"]} &nbsp;
					<a target="_blank" href={TandC(userInfo.langId).terms}>
						{i18n["lbl_TermsConditions"]}
					</a>
					&nbsp; {i18n["lbl_Check18TC2"]}&nbsp;
					<a target="_blank" href={TandC(userInfo.langId).rule}>
						{i18n["lbl_RuleRegulations"]}
					</a>
					&nbsp; {i18n["lbl_Check18TC3"]}&nbsp;{config.siteName}
					.&nbsp;
					{i18n["lbl_Check18TC4"]}
				</Checkbox>
				{warningState.Checkbox.status ? (
					<div className="JoinRule open">
						{i18n.lbl_Check18TCTooltip}
					</div>
				) : null}
				<div className="btn-group">
					<button onClick={checklistHandler}>
						{i18n["lbl_JoinNow"]}
					</button>
				</div>
			</div>
			<PromoPopup
				banner={banner}
				ImgFolder="Promotion"
				ClickClose={ClosePromoPopup}
				title={i18n.lbl_Welcome}
				isOpen={promoPopup}
			/>
		</>
	) : (
		<Redirect to="/" noThrow />
	);
};

export default Join;
