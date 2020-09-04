import React, { useState, useContext, useRef, useEffect } from "react";
import { Redirect } from "@reach/router";
import Inputbox from "../common/inputbox";
import Dropdown from "../common/dropdown.icon";
import { i18nContext, userInfoContext, popBoxContext } from "../common/context";
import areaCode from "../../datas/areaCode";
import moment from "moment";
import {
	api_SetProfile,
	api_GetCustProfile
} from "../../service/api/accountStrict";
import path from "../../path";

const defStatus = {
	LockAll: "LockAll",
	RealName: "RealName",
	Phone_BDay: "Phone_BDay",
	RealName_Phone_BDay: "RealName_Phone_BDay",
	BDay: "BDay"
};

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
	RealName: {
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
	}
};

const defColumns = {
	RealName: "RealName",
	Birthday: "Birthday",
	Phone: "Phone"
};

const defCheckList = {
	RealName: [defColumns.RealName],
	Phone_BDay: [defColumns.Birthday, defColumns.Phone],
	RealName_Phone_BDay: [
		defColumns.RealName,
		defColumns.Birthday,
		defColumns.Phone
	],
	BDay: [defColumns.Birthday]
};

const Panel = () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userValueState, setUserValueState] = useState({});
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

	let aCode = country ? areaCode[country].AreaCode : "";
	let status = defStatus.LockAll;
	if (userInfo.accountName && !userInfo.phoneNo) {
		status = defStatus.Phone_BDay;
	} else if (!userInfo.accountName && !userInfo.phoneNo) {
		status = defStatus.RealName_Phone_BDay;
	} else if (!userInfo.accountName) {
		status = defStatus.RealName;
	} else if (!userInfo.birth_d) {
		status = defStatus.BDay;
	}

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
			content: `(${aCode})${userInfo.phoneNo}`
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
		if (val === "" || isNaN(val)) {
			checked = false;
			message = i18n["msg_EnterPhoneNumber"];
		}

		return { checked, message };
	};

	const checkRealName = val => {
		let checked = true;
		let message = "";
		if (val === "" || val === null || val === undefined) {
			checked = false;
			message = i18n["msg_EnterRealName"];
		}

		return { checked, message };
	};

	const checkSwitch = (val, colName) => {
		if (colName === "RealName") {
			return checkRealName(val);
		} else if (colName === "Phone") {
			return checkPhone(val);
		} else {
			return { checked: true, message: "" };
		}
	};

	const checkInputboxHandler = (col, e) => {
		const val = e.target.value;
		let result = checkSwitch(val, col);
		setWarningState(prevState => {
			return {
				...prevState,
				[col]: {
					status: !result.checked,
					msg: result.message
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

	const checkSubmitHandler = _status => {
		let checked = true;
		let year = yearOptions[yearSelectedIdx]?.value;
		let month = monthOptions[monthSelectedIdx]?.value;
		let day = daySelectedIdx + 1;

		let checkList = defCheckList[_status];
		for (let i in checkList) {
			let col = checkList[i];
			if (col === defColumns.Birthday) {
				if (
					year === undefined ||
					month === undefined ||
					day === undefined
				) {
					setWarningState(prevState => {
						return {
							...prevState,
							Birthday: {
								status: true,
								msg: i18n.msg_SelectBirthDay
							}
						};
					});
					checked = false;
				} else {
					setWarningState(prevState => {
						return {
							...prevState,
							Birthday: {
								status: false,
								msg: ""
							}
						};
					});
				}
			} else {
				let result = checkSwitch(userValueState[col], col);
				setWarningState(prevState => {
					return {
						...prevState,
						[col]: {
							status: !result.checked,
							msg: result.message
						}
					};
				});
				checked = checked ? result.checked : false;
			}
		}

		if (checked) {
			setUserValueState(prevState => ({
				...prevState,
				Birth: `${year} / ${month} / ${day}`
			}));

			const closePopbox = ({ _redirectPath }) => {
				setPopBox({ isOpen: false });
				if (_redirectPath) {
					setRedirectPath(_redirectPath);
				}
			};

			const setProfile = () => {
				let profileData = {
					AccountName:
						userValueState.RealName ?? userInfo.accountName,
					Birth_d: `${day}`,
					Birth_m: `${month}`,
					Birth_y: `${year}`,
					CountryCode: country,
					AreaCode: aCode,
					PhoneNo: userValueState.Phone ?? userInfo.phoneNo
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

			if (status === defStatus.Phone_BDay || status === defStatus.BDay) {
				setProfile();
			} else {
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
		}
	};

	let arr = infoList
		.filter(item => {
			return (
				userInfo[item.infoTitle] ||
				(item.infoTitle === "birth" && item.birth_d)
			);
		})
		.map(item => {
			return (
				<ColumnItem
					key={`profile-${item.infoTitle}`}
					title={item.colTitle}
					content={item.content}
				/>
			);
		});

	return redirectPath !== null ? (
		<Redirect to={redirectPath} noThrow />
	) : (
		<>
			{status !== defStatus.LockAll ? (
				<>
					{status === defStatus.RealName ||
					status === defStatus.RealName_Phone_BDay ? (
						<Inputbox
							icon="icon-member"
							inputType="text"
							placeholder={i18n["lbl_RealName"]}
							onBlur={checkInputboxHandler.bind(null, "RealName")}
							onChange={EditField.bind(null, "RealName")}
							Warning={warningState.RealName}
							value={userValueState.RealName}
						/>
					) : null}

					{status === defStatus.RealName_Phone_BDay ||
					status === defStatus.Phone_BDay ||
					status === defStatus.BDay ? (
						<Birthday
							i18n={i18n}
							userValueState={userValueState}
							monthOptions={monthOptions}
							dateOptions={dateOptions}
							yearOptions={yearOptions}
							yearSelectedIdx={yearSelectedIdx}
							monthSelectedIdx={monthSelectedIdx}
							daySelectedIdx={daySelectedIdx}
							Warning={warningState.Birthday}
							dropdownStateHandler={
								dropdownStateHandler
							}></Birthday>
					) : null}

					{status === defStatus.RealName_Phone_BDay ||
					status === defStatus.Phone_BDay ? (
						<div className="inputBox parts">
							<span className="countryCode">{aCode}</span>

							<Inputbox
								icon="icon-phone"
								inputType="tel"
								placeholder={i18n["lbl_Phone"]}
								onBlur={checkInputboxHandler.bind(
									null,
									"Phone"
								)}
								onChange={EditField.bind(null, "Phone")}
								value={userValueState.Phone}
							/>
							<div
								className={`errortip ${
									warningState.Phone.status ? "open" : ""
								}`}>
								{warningState.Phone.msg}
							</div>
						</div>
					) : null}

					{status !== 4 ? (
						<div className="btn-group">
							<button
								className="orange"
								onClick={checkSubmitHandler.bind(this, status)}>
								{i18n["lbl_Submit"]}
							</button>
						</div>
					) : null}
				</>
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
			<span className="title">{props.title}</span>
			<span>{props.content}</span>
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
