import React, { useState, useContext, useEffect, useRef } from "react";
import { i18nContext, userInfoContext, popBoxContext } from "../common/context";
import { api_GetBankInfoSysList } from "../../service/api/payment";
import {
	api_SetCustBankInfo,
	api_DelCustBankInfo
} from "../../service/api/accountStrict";
import { api_GetCustBankInfo } from "../../service/api/account";
import Inputbox from "../common/inputbox";
import Dropdown from "../common/dropdown.image";
import config from "../../config";
import Loading from "../common/loading";

const initWarningState = {
	RealName: {
		status: false,
		msg: ""
	},
	BankAccount: {
		status: false,
		msg: ""
	}
};

const BankInfo = () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { i18n } = useContext(i18nContext);
	const [siteBankInfoState, setSiteBankInfoState] = useState([]);
	const [getBankInfo, setGetBankInfo] = useState([]);
	const [status, setStatus] = useState(true);
	const [userValueState, setUserValueState] = useState({});
	const [bankSelectedIdx, setBankSelectedIdx] = useState(0);
	const [warningState, setWarningState] = useState(initWarningState);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (!userInfo.accountName && isMountedRef.current) {
			setStatus(true);
		}
	}, [userInfo.accountName]);

	useEffect(() => {
		if (userInfo.isLogin) {
			setLoading(true);
			api_GetCustBankInfo().then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							let data = res.data.data;
							if (data !== null) {
								let bankInfoDetail = data.bankInfoDetail ?? [];
								let getBankInfoArr = bankInfoDetail.map(i => {
									return {
										bankName: i.bankName,
										image: i.bankLogo,
										accountNo: i.accountNo,
										SysId: i.sysId
									};
								});
								setGetBankInfo(() => getBankInfoArr);
							}
						} else {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message
							});
						}
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: i18n.msg_ApiServerError
						});
						setLoading(false);
					}
				}
			);
		}
	}, [
		i18n.lbl_ImportantNote,
		i18n.msg_ApiServerError,
		setPopBox,
		userInfo.isLogin
	]);

	const toAddBankAccount = () => {
		setLoading(true);
		api_GetBankInfoSysList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						const data = res.data.data;
						let bankInfoArr = data.map(i => {
							return {
								id: i.sysId,
								sysId: i.sysId,
								bankName: i.bankName,
								image: i.bankLogo,
								displayText: i.bankName
							};
						});

						setSiteBankInfoState(() => bankInfoArr);
						setStatus(false);
						setBankSelectedIdx(0);
						setWarningState(initWarningState);
						setUserValueState({});
					} else {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: res.data.message
						});
					}
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ApiServerError
					});

					setLoading(false);
				}
			}
		);
	};

	const toShowBankAccount = () => {
		setLoading(false);
		setStatus(true);
		setPopBox({ isOpen: false });
	};

	const dropdownStateHandler = i => {
		setBankSelectedIdx(i);
	};

	const checkInputboxHandler = (col, e) => {
		const val = e.target.value;
		let checked = true;
		let message = "";

		if (col === "RealName") {
			if (val === "" || !isNaN(val)) {
				checked = false;
				message = i18n["msg_EnterRealName"];
			}
		} else if (col === "BankAccount") {
			if (val === "" || isNaN(val)) {
				checked = false;
				message = i18n["msg_NeedAccountNo"];
			}
		}

		setUserValueState(prevState => ({
			...prevState,
			[col]: val
		}));

		setWarningState(prevState => {
			return {
				...prevState,
				[col]: {
					status: !checked,
					msg: message
				}
			};
		});
	};

	const EditField = (col, e) => {
		let val = e.target.value;
		setUserValueState(prevState => ({
			...prevState,
			[col]: val
		}));
	};

	const GetCustBankInfo = () => {
		setLoading(true);

		api_GetCustBankInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let data = res.data.data;
						if (data !== null) {
							let bankInfoDetail = data.bankInfoDetail ?? [];
							let getBankInfoArr = bankInfoDetail.map(i => {
								return {
									bankName: i.bankName,
									image: i.bankLogo,
									accountNo: i.accountNo,
									SysId: i.sysId
								};
							});
							setGetBankInfo(preV => getBankInfoArr);
							setUserInfo(prevState => ({
								...prevState,
								accountName: data.accountName
							}));
							setLoading(false);
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
	};

	const removeAccountHandler = val => {
		setLoading(true);

		const removeAccount = () => {
			let removeAccountData = {
				AccountName: userInfo.accountName,
				AccountNo: val.accountNo,
				SysId: val.SysId
			};
			setPopBox({ isOpen: false });
			api_DelCustBankInfo(removeAccountData).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							GetCustBankInfo();
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
						setLoading(false);
					}
				}
			);
		};

		setPopBox({
			isOpen: true,
			title: "",
			content: i18n["lbl_CheckConfirm"],
			hasBtn: true,
			btnBar: (
				<div className="btn-group">
					<button className="blue" onClick={toShowBankAccount}>
						{i18n["lbl_Cancel"]}
					</button>
					<button className="orange" onClick={removeAccount}>
						{i18n["lbl_Submit"]}
					</button>
				</div>
			)
		});
		setLoading(false);
	};

	const realNameCheck = () => {
		let checked = true;
		if (
			userValueState.RealName === "" ||
			userValueState.RealName === undefined
		) {
			checked = false;
			setWarningState(prevState => {
				return {
					...prevState,
					RealName: {
						status: !checked,
						msg: i18n["msg_EnterRealName"]
					}
				};
			});
		} else {
			checked = true;
			setWarningState(prevState => {
				return {
					...prevState,
					RealName: {
						status: !checked,
						msg: ""
					}
				};
			});
		}
		return checked;
	};
	const bankAccountCheck = () => {
		let checked = true;
		if (
			userValueState.BankAccount === "" ||
			userValueState.BankAccount === undefined
		) {
			checked = false;
			setWarningState(prevState => {
				return {
					...prevState,
					BankAccount: {
						status: !checked,
						msg: i18n["msg_NeedAccountNo"]
					}
				};
			});
		} else {
			checked = true;
			setWarningState(prevState => {
				return {
					...prevState,
					BankAccount: {
						status: !checked,
						msg: ""
					}
				};
			});
		}
		return checked;
	};

	const checkSubmitHandler = () => {
		let checked = true;

		const SetCustBankInfo = (checked, hidePopBox) => {
			if (hidePopBox) {
				setPopBox({ isOpen: false });
			}

			if (checked) {
				let bankInfoData = {
					AccountName:
						userInfo.accountName ?? userValueState.RealName,
					AccountNo: userValueState.BankAccount,
					SysId: siteBankInfoState[bankSelectedIdx].id
				};
				setLoading(true);
				api_SetCustBankInfo(bankInfoData).then(
					response => {
						if (isMountedRef.current) {
							const errorCode = response.data.errorCode;
							const message = response.data.message;

							if (errorCode !== 0) {
								setPopBox({
									isOpen: true,
									title: i18n["lbl_ImportantNote"],
									content: message
								});
							} else {
								GetCustBankInfo();
							}
							setLoading(false);
						}
					},
					err => {
						if (isMountedRef.current) {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: i18n.msg_ApiServerErrors
							});
							setLoading(false);
						}
					}
				);
				setStatus(true);
			}
		};

		if (status === false) {
			if (!userInfo.accountName) {
				checked = realNameCheck() && bankAccountCheck();

				const closePopbox = status => {
					setPopBox({ isOpen: false });
				};

				setPopBox({
					isOpen: true,
					title: i18n.lbl_ImportantNote,
					content: i18n.msg_ConfirmRealNameAlert,
					hasBtn: true,
					btnBar: (
						<div className="btn-group">
							<button className="blue" onClick={closePopbox}>
								{i18n["lbl_Cancel"]}
							</button>
							<button
								className="orange"
								onClick={SetCustBankInfo.bind(
									this,
									checked,
									true
								)}>
								{i18n["lbl_Submit"]}
							</button>
						</div>
					)
				});
			} else {
				checked = bankAccountCheck();
				SetCustBankInfo(checked, false);
			}
		}
	};

	let arr = getBankInfo.map(item => {
		return (
			<BankAccountItem
				key={`bankAccount-${item.accountNo}`}
				title={item.bankName}
				accountNo={item.accountNo}
				removeAccountHandler={removeAccountHandler.bind(null, item)}
				image={`${config.imgUrl}/common/images/BankLogo/${item.image}`}
				className="bankLogo"
				loading={loading}
			/>
		);
	});

	return loading ? (
		<Loading />
	) : (
		<>
			<div className="avatar"></div>
			<div className="name">{userInfo.accountName}</div>
			{status === true ? (
				<>
					{userInfo.accountName ? (
						<div className="text-org">{i18n["lbl_ContactCSD"]}</div>
					) : null}
					{getBankInfo && getBankInfo.length < 3 ? (
						<div className="btn-group">
							<button
								className="orange"
								onClick={toAddBankAccount}>
								<i className="icon icon-user-plus"></i>
								{i18n["lbl_AddNewAccount"]}
							</button>
						</div>
					) : null}
				</>
			) : (
				<>
					{" "}
					<div className="inputBox">
						<Dropdown
							mainKey="bankInfo-bankList"
							options={siteBankInfoState}
							colName="getBankInfo"
							className="bankLogo"
							ImgURL={`${config.imgUrl}/common/images/BankLogo/`}
							selectedIdx={bankSelectedIdx}
							onSelectItem={dropdownStateHandler}
						/>
					</div>
					{!userInfo.accountName ? (
						<Inputbox
							icon="icon-member"
							inputType="text"
							value={userValueState.RealName}
							placeholder={i18n["lbl_RealName"]}
							onBlur={checkInputboxHandler.bind(null, "RealName")}
							onChange={EditField.bind(null, "RealName")}
							Warning={warningState.RealName}
						/>
					) : null}
					<Inputbox
						icon="icon-newspaper"
						Warning={warningState.BankAccount}
						inputType="tel"
						value={userValueState.BankAccount}
						placeholder={i18n["lbl_BankNumber"]}
						onBlur={checkInputboxHandler.bind(null, "BankAccount")}
						onChange={EditField.bind(null, "BankAccount")}
					/>
					<div className="btn-group">
						<button className="blue" onClick={toShowBankAccount}>
							{i18n["lbl_Cancel"]}
						</button>
						<button className="orange" onClick={checkSubmitHandler}>
							{i18n["lbl_Submit"]}
						</button>
					</div>
				</>
			)}
			{status === true ? (
				<>
					{getBankInfo && getBankInfo.length > 0 ? (
						<div className="smallTitle">
							<i className="icon icon-library"></i>
							{i18n["lbl_BankAccount"]}
						</div>
					) : null}
					<div className="bankAccount">{arr}</div>
				</>
			) : null}
		</>
	);
};

const BankAccountItem = props => {
	return (
		<div className="account">
			<div className={props.className}>
				<img src={props.image} alt="" />
			</div>
			<div className="info">
				<ul>
					<li>
						<span className="title">{props.title}</span>
						<span>{props.accountNo}</span>
					</li>
				</ul>
			</div>
			<button
				className="icon icon-bin clickBtn"
				onClick={props.removeAccountHandler}></button>
		</div>
	);
};

export default BankInfo;
