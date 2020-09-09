import React, { useState, useContext, useRef, useEffect } from "react";
import { Redirect } from "@reach/router";
import Inputbox from "../common/inputbox";
import Dropdown from "../common/dropdown.icon";
import { i18nContext, userInfoContext, popBoxContext } from "../common/context";
import areaCode from "../../datas/areaCode";
import moment from "moment";
import {
	api_SetProfile,
	api_GetCustProfile,
	api_VerifyPhone
} from "../../service/api/accountStrict";
import { api_ExistsEmail } from "../../service/api/site";
import { defPopBoxType } from "../common/popbox";
import path from "../../path";

const monthOptions = [
	{ value: 1, id: 0, displayKey: "lbl_Month1" },
	{ value: 2, id: 1, displayKey: "lbl_Month2" },
	{ value: 3, id: 2, displayKey: "lbl_Month3" },
	{ value: 4, id: 3, displayKey: "lbl_Month4" },
	{ value: 5, id: 4, displayKey: "lbl_Month5" },
	{ value: 6, id: 5, displayKey: "lbl_Month6" },
	{ value: 7, id: 6, displayKey: "lbl_Month7" },
	{ value: 8, id: 7, displayKey: "lbl_Month8" },
	{ value: 9, id: 8, displayKey: "lbl_Month9" },
	{ value: 10, id: 9, displayKey: "lbl_Month10" },
	{ value: 11, id: 10, displayKey: "lbl_Month11" },
	{ value: 12, id: 11, displayKey: "lbl_Month12" }
];

const initWarningState = {
	AccountName: {
		status: false,
		msg: ""
	},
	Birthday: {
		status: false,
		msg: ""
	},
	Phone: {
		status: false,
		msg: ""
	},
	Email: {
		status: false,
		msg: ""
	}
};

const Panel = () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [warningState, setWarningState] = useState(initWarningState);
	const [yearSelectedIdx, setYearSelectedIdx] = useState();
	const [monthSelectedIdx, setMonthSelectedIdx] = useState();
	const [daySelectedIdx, setDaySelectedIdx] = useState();

	const country = userInfo.country ? userInfo.country : userInfo.perCountry;
	const isMountedRef = useRef(null);
	const [redirectPath, setRedirectPath] = useState(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(`/${path.member.root}`);
		}
	}, [redirectPath]);

	const initUserValue = {
		AccountName: userInfo.accountName ?? "",
		Birth_d: userInfo.Birth_d ?? "",
		Birth_m: userInfo.Birth_m ?? "",
		Birth_y: userInfo.Birth_y ?? "",
		PhoneNo: userInfo.phoneNo ?? "",
		Email: userInfo.email ?? ""
	};

	const [userValue, setuserValue] = useState(initUserValue);

	let aCode = country ? areaCode[country].AreaCode : "";

	let infoList = [
		{
			infoTitle: "accountName",
			colTitle: i18n["lbl_RealName"],
			content: userInfo.accountName
		},
		{
			infoTitle: "birth",
			colTitle: i18n["lbl_Birthday"],
			content: `${userInfo.birth_m}/${userInfo.birth_d}/${userInfo.birth_y}`,
			birth_d: userInfo.birth_d,
			birth_m: userInfo.birth_m,
			birth_y: userInfo.birth_y
		},
		{
			infoTitle: "phoneNo",
			colTitle: i18n["lbl_Phone"],
			content: `(${aCode})${userInfo.phoneNo}`,
			isVerified: userInfo.phoneVerified
		},
		{
			infoTitle: "userName",
			colTitle: i18n["lbl_Username"],
			content: userInfo.userName
		},
		{
			infoTitle: "country",
			colTitle: i18n["lbl_Country"],
			content: i18n[`lbl_Country${userInfo.country}`]
		},
		{
			infoTitle: "email",
			colTitle: i18n["lbl_Email"],
			content: userInfo.email
		},
		{
			infoTitle: "regTime",
			colTitle: i18n["lbl_RegisterTime"],
			content: date_format(userInfo.regTime)
		},
		{
			infoTitle: "lastLogin",
			colTitle: i18n["lbl_LastLogin"],
			content: date_format(userInfo.lastLogin)
		}
	];

	let yearOptions = [];
	let dateOptions = [];

	let startYear = GetYear();
	let month =
		monthSelectedIdx === undefined
			? ""
			: monthOptions[monthSelectedIdx].value;

	let _startYear = startYear - 59;
	for (let i = startYear; i >= _startYear; i--) {
		yearOptions.push({ value: i, id: i, displayText: i });
	}
	let year =
		yearSelectedIdx === undefined ? "" : yearOptions[yearSelectedIdx].value;

	let days = GetDayOfMonth(year, month);
	for (let i = 1; i <= days; i++) {
		dateOptions.push({ value: i, id: i, displayText: i });
	}

	const dropdownStateHandler = (col, i) => {
		if (col === "bday_year") {
			setYearSelectedIdx(i);
		} else if (col === "bday_month") {
			setMonthSelectedIdx(i);
		} else {
			setDaySelectedIdx(i);
		}
	};

	const checkPhone = val => {
		let checked = true;
		let message = "";

		if (userInfo.phoneNo) {
			return { checked, message };
		}

		if (val === "" || isNaN(val)) {
			checked = false;
			message = i18n["msg_EnterPhoneNumber"];
		}

		return { checked, message };
	};

	const checkAccountName = val => {
		let checked = true;
		let message = "";

		if (userInfo.accountName) {
			return { checked, message };
		}

		if (val === "" || val === null || val === undefined) {
			checked = false;
			message = i18n["msg_EnterRealName"];
		}

		return { checked, message };
	};

	const checkEmail = val => {
		let checked = true;
		let message = "";
		const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (userInfo.email) {
			return { checked, message };
		}

		if (val === "" || val === null) {
			checked = false;
			message = i18n["msg_MailWrongFormat"];
		} else {
			if (!regx.test(val)) {
				checked = false;
				message = i18n["msg_MailWrongFormat"];
			}
		}

		if (checked) {
			api_ExistsEmail({
				Email: val
			}).then(
				response => {
					if (isMountedRef.current) {
						const res = response.data;
						if (res.errorCode === 0) {
							if (res.data === true) {
								setWarningState(prevState => {
									return {
										...prevState,
										Email: {
											status: true,
											msg: i18n["msg_MailExisted"]
										}
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
		}

		return { checked, message };
	};

	const checkBirth = () => {
		let checked = true;
		let message = "";

		if (userInfo.birth_d && userInfo.birth_m && userInfo.birth_y) {
			return { checked, message };
		}

		let year = yearOptions[yearSelectedIdx]?.value;
		let month = monthOptions[monthSelectedIdx]?.value;
		let day = daySelectedIdx + 1;

		if (!year || !month || !day) {
			checked = false;
			message = i18n["msg_SelectBirthDay"];
		}

		return { checked, message };
	};

	const checkInputboxHandler = (col, e) => {
		const val = e.target.value;
		let checked = true;
		let msg = "";

		if (col === "AccountName") {
			let result = checkAccountName(val);
			checked = result.checked;
			msg = result.message;
		} else if (col === "Email") {
			let result = checkEmail(val);
			checked = result.checked;
			msg = result.message;
		} else {
			let result = checkPhone(val);
			checked = result.checked;
			msg = result.message;
		}

		setWarningState(prevState => {
			return {
				...prevState,
				[col]: {
					status: !checked,
					msg: msg
				}
			};
		});
	};

	const EditField = (col, e) => {
		let val = e.target.value;

		if (col === "AccountName") {
			val = val.replace(/[\W]/g, "");
		} else if (col === "Phone") {
			val = val.replace(/^(0+)|[^\d]+/g, "");
		}

		setuserValue(prevState => ({
			...prevState,
			[col]: val
		}));
	};

	const checkAll = () => {
		let _accountNameCheck = checkAccountName(
			userInfo.accountName ?? userValue.AccountName
		);
		let _emailCheck = checkEmail(userValue.Email);
		let _phoneCheck = checkPhone(userValue.Phone);
		let _birthCheck = checkBirth();

		let checked =
			_accountNameCheck.checked &&
			_emailCheck.checked &&
			_phoneCheck.checked &&
			_birthCheck.checked;

		if (!checked) {
			setWarningState(prev => ({
				...prev,
				AccountName: {
					status: !_accountNameCheck.checked,
					msg: _accountNameCheck.message
				},
				Birthday: {
					status: !_birthCheck.checked,
					msg: _birthCheck.message
				},
				Phone: {
					status: !_phoneCheck.checked,
					msg: _phoneCheck.message
				},
				Email: {
					status: !_emailCheck.checked,
					msg: _emailCheck.message
				}
			}));
		}
		return checked;
	};

	const checkSubmitHandler = () => {
		let checked = checkAll();

		if (checked) {
			const closePopbox = ({ _redirectPath }) => {
				setPopBox({ isOpen: false });
				if (_redirectPath) {
					setRedirectPath(_redirectPath);
				}
			};

			const setProfile = () => {
				let profileData = {
					AccountName: userValue.AccountName ?? userInfo.accountName,
					Birth_d: `${daySelectedIdx + 1}`,
					Birth_m: `${monthOptions[monthSelectedIdx]?.value}`,
					Birth_y: `${yearOptions[yearSelectedIdx]?.value}`,
					CountryCode: country,
					AreaCode: aCode,
					PhoneNo: userValue.Phone ?? userInfo.phoneNo,
					Email: userValue.Email ?? userInfo.email
				};

				api_SetProfile(profileData).then(
					response => {
						if (isMountedRef.current) {
							const errorCode = response.data.errorCode;
							const message = response.data.message;

							if (errorCode === 0) {
								api_GetCustProfile().then(
									res => {
										if (isMountedRef.current) {
											if (res.data.errorCode === 0) {
												setUserInfo(prevState => ({
													...prevState,
													...res.data.data
												}));
											} else {
												setPopBox({
													isOpen: true,
													title:
														i18n.lbl_ImportantNote,
													content:
														response.data.message
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
								setPopBox({
									isOpen: true,
									title: i18n.msg_Updatesuccessful,
									content: i18n.msg_GoToDepositPage,
									hasBtn: true,
									btnBar: (
										<div className="btn-group">
											<button
												className="blue"
												onClick={closePopbox}>
												{i18n["lbl_Cancel"]}
											</button>
											<button
												className="orange"
												onClick={closePopbox.bind(
													null,
													{
														_redirectPath: `/${path.deposit.root}`
													}
												)}>
												{i18n["lbl_Confirm"]}
											</button>
										</div>
									)
								});
							} else if (errorCode === 21) {
								setWarningState(prevState => ({
									...prevState,
									Phone: { status: true, msg: message }
								}));
							} else {
								setPopBox({
									isOpen: true,
									title: i18n.lbl_ImportantNote,
									content: message
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
						<button className="orange" onClick={setProfile}>
							{i18n["lbl_Submit"]}
						</button>
					</div>
				)
			});
		}
	};

	const clickOtp = () => {
		const closePopbox = () => {
			setPopBox({ isOpen: false });
		};

		const clickSubmit = (otpCode, requestId) => {
			console.log(otpCode, requestId);
			api_VerifyPhone({
				request_id: requestId,
				code: otpCode
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setUserInfo(prev => ({
								...prev,
								PhoneVerified: true
							}));

							setPopBox({ isOpen: false });
						} else {
							setPopBox({
								isOpen: true,
								title: "OTP Certification",
								content: res.data.message,
								hasBtn: true,
								btnBar: (
									<div className="btn-group">
										<button
											className="blue"
											onClick={closePopbox}>
											{i18n["lbl_Cancel"]}
										</button>
									</div>
								)
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

		const openOtpPopbox = () => {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Otp,
				title: "OTP Certification",
				clickSubmit: clickSubmit
			});
		};
		openOtpPopbox();
	};

	let arr = infoList
		.filter(item => {
			return (
				userInfo[item.infoTitle] ||
				(item.infoTitle === "birth" && item.birth_d)
			);
		})
		.map(item => {
			let _isVerified =
				item.infoTitle === "phoneNo" ? item.isVerified : null;

			return (
				<ColumnItem
					key={`profile-${item.infoTitle}`}
					title={item.colTitle}
					content={item.content}
					infoTitle={item.infoTitle}
					clickOtp={clickOtp}
					isVerified={_isVerified}
				/>
			);
		});

	return redirectPath !== null ? (
		<Redirect to={redirectPath} noThrow />
	) : (
		<>
			{!userInfo.accountName ? (
				<Inputbox
					icon="icon-member"
					inputType="text"
					placeholder={i18n["lbl_RealName"]}
					onBlur={checkInputboxHandler.bind(null, "AccountName")}
					onChange={EditField.bind(null, "AccountName")}
					Warning={warningState.AccountName}
					value={userValue.AccountName}
				/>
			) : null}

			{!userInfo.email ? (
				<Inputbox
					icon="icon-email"
					inputType="text"
					placeholder={i18n["lbl_Email"]}
					onBlur={checkInputboxHandler.bind(null, "Email")}
					onChange={EditField.bind(null, "Email")}
					Tips={i18n["lbl_EmailToolTip"]}
					Warning={warningState.Email}
					value={userValue.Email}
				/>
			) : null}

			{!userInfo.birth_d || !userInfo.birth_m || !userInfo.birth_y ? (
				<Birthday
					i18n={i18n}
					userValue={userValue}
					monthOptions={monthOptions}
					dateOptions={dateOptions}
					yearOptions={yearOptions}
					yearSelectedIdx={yearSelectedIdx}
					monthSelectedIdx={monthSelectedIdx}
					daySelectedIdx={daySelectedIdx}
					Warning={warningState.Birthday}
					dropdownStateHandler={dropdownStateHandler}></Birthday>
			) : null}

			{!userInfo.phoneNo ? (
				<div className="inputBox parts">
					<span className="countryCode">{aCode}</span>

					<Inputbox
						icon="icon-phone"
						inputType="tel"
						placeholder={i18n["lbl_Phone"]}
						onBlur={checkInputboxHandler.bind(null, "Phone")}
						onChange={EditField.bind(null, "Phone")}
						value={userValue.Phone}
						WarningIcon={warningState.Phone.status}
					/>
					<div
						className={`errortip ${
							warningState.Phone.status ? "open" : ""
						}`}>
						{warningState.Phone.msg}
					</div>
				</div>
			) : null}

			{!userInfo.accountName ||
			!userInfo.birth_d ||
			!userInfo.phoneNo ||
			!userInfo.email ? (
				<div className="btn-group">
					<button className="orange" onClick={checkSubmitHandler}>
						{i18n["lbl_Submit"]}
					</button>
				</div>
			) : null}

			<div className="info">
				<ul>{arr}</ul>
			</div>
		</>
	);
};

const Birthday = props => {
	return (
		<div className="inputBox parts">
			<Dropdown
				i18n={props.i18n}
				mainKey="profile-month"
				options={props.monthOptions}
				colName="bday_month"
				onSelectItem={props.dropdownStateHandler.bind(
					null,
					"bday_month"
				)}
				selectedIdx={props.monthSelectedIdx}
				icon="icon icon-cake"
			/>
			<Dropdown
				mainKey="profile-day"
				options={props.dateOptions}
				colName="bday_day"
				onSelectItem={props.dropdownStateHandler.bind(null, "bday_day")}
				selectedIdx={props.daySelectedIdx}
			/>
			<Dropdown
				mainKey="profile-year"
				options={props.yearOptions}
				colName="bday_year"
				onSelectItem={props.dropdownStateHandler.bind(
					null,
					"bday_year"
				)}
				selectedIdx={props.yearSelectedIdx}
			/>
			<div className={`errortip${props.Warning.status ? " open" : ""}`}>
				{props.Warning.msg}
			</div>
		</div>
	);
};

const ColumnItem = props => {
	return (
		<li>
			<span className="title">
				{props.title}
				{props.isVerified ? <i class="icon icon-checkmark"></i> : null}
			</span>
			<span>{props.content}</span>
			{props.infoTitle === "phoneNo" && !props.isVerified ? (
				<>
					<button className="otpBtn" onClick={props.clickOtp}>
						<span className="icon icon-mobile"></span>
						<span>Mobile verification</span>
					</button>
				</>
			) : null}
		</li>
	);
};

const GetYear = () => {
	return new Date().getFullYear() - 21;
};

const GetDayOfMonth = (year, month) => {
	let d = new Date(year, month, 0);
	return d.getDate();
};

const date_format = v => {
	return moment(new Date(v)).format("lll");
};

export default Panel;
