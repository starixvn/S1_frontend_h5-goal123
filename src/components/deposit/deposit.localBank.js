import React, { useState, useEffect, useContext, useRef } from "react";
import Step from "./step";
import { Link, Redirect } from "@reach/router";
import DropdownIMG from "../common/dropdown.image";
import config from "../../config";
import {
	i18nContext,
	userInfoContext,
	popBoxContext,
	bankSlipPopBoxContext
} from "../common/context";
import LimitTip from "./limitTip";
import { isConvert, checkAmount, number_format } from "../common/common";
import InputBox from "../common/inputbox";
import {
	api_DepositReqWireTransfer,
	api_GetBankInfoOffList
} from "../../service/api/payment";
import moment from "moment";
import PageVerify from "./deposit.pageVerify";
import path from "../../path";
import Loading from "../common/loading";
import Promotion from "./deposit.promotion";
import { api_SetAccountName } from "../../service/api/accountStrict";

export const Panel = props => props.children;

export const Main = props => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { setbankSlipPopBox } = useContext(bankSlipPopBoxContext);

	const [bankList, setBankList] = useState([]);
	const [selBank, setSelBank] = useState({
		idx: null,
		bank: null
	});
	const [amount, setAmount] = useState("");
	const [accountName, setAccountName] = useState(userInfo.accountName);
	const [warning, setWarning] = useState({
		accountName: { status: false, msg: "" },
		amount: { status: false, msg: "" }
	});

	const _isConvert = isConvert(userInfo.currencyId);
	const [processing, setProcessing] = useState(false);

	const [redirectPath, setRedirectPath] = useState(null);
	const [pageVerify, setPageVerify] = useState(true);
	const [loading, setLoading] = useState(true);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	PageVerify(
		userInfo,
		i18n,
		setPopBox,
		setRedirectPath,
		setPageVerify,
		props.location.state?.paymentList?.length >= 0
	);

	useEffect(() => {
		if (props.location.state?.paymentList) {
			let datas = props.location.state.paymentList.map(b => {
				let { bankLogo, sysId, bankName, ...rest } = b;
				return {
					...rest,
					image: bankLogo,
					id: sysId,
					displayText: bankName
				};
			});
			if (isMountedRef.current) {
				setLoading(false);
				setBankList(datas);
				setProcessing(false);
			}
		} else {
			if (userInfo.isLogin) {
				setLoading(true);
				api_GetBankInfoOffList().then(
					res => {
						if (isMountedRef.current) {
							if (res.data.errorCode === 0) {
								let datas = res.data.data.map(b => {
									let {
										bankLogo,
										sysId,
										bankName,
										...rest
									} = b;
									return {
										...rest,
										image: bankLogo,
										id: sysId,
										displayText: bankName
									};
								});
								if (datas.length > 0) {
									setBankList(datas);
								} else {
									setRedirectPath(`/${path.deposit.root}`);
								}
							}

							setLoading(false);
						}
					},
					err => {
						if (isMountedRef.current) {
							setLoading(false);
						}
					}
				);
			}
		}
	}, [props.location.state, userInfo.isLogin]);

	const SelectBank = idx => {
		setSelBank({
			idx: idx,
			bank: bankList[idx]
		});
	};

	const VaildAmount = _amount => {
		let result = checkAmount(
			_amount,
			selBank?.bank?.minAmount,
			selBank?.bank?.maxAmount,
			_isConvert,
			i18n
		);
		if (result.status !== 0) {
			setWarning(prev => ({
				...prev,
				amount: {
					status: true,
					msg: result.msg
				}
			}));
		} else {
			setWarning(prev => ({
				...prev,
				amount: {
					status: false,
					msg: ""
				}
			}));
		}
		return result.status === 0;
	};

	const EditField = (col, e) => {
		let value = e.target.value;

		if (col === "amount") {
			if (selBank.bank) {
				VaildAmount(value);
				setAmount(value);
			} else {
				setWarning(prev => ({
					...prev,
					amount: {
						status: true,
						msg: i18n.lbl_SelectBank
					}
				}));
			}
		} else {
			setAccountName(value);
			setWarning(prev => ({
				...prev,
				accountName: {
					status: false,
					msg: ""
				}
			}));
		}
	};

	const ClickSubmit = () => {
		if (!processing) {
			let result = VaildAmount(amount) && accountName;

			if (result && pageVerify) {
				const RedirectToNext = (real_amount, sysId) => {
					api_DepositReqWireTransfer({
						amount: real_amount,
						sysId: sysId
					}).then(
						res => {
							if (isMountedRef.current) {
								if (res.data.errorCode === 0) {
									setbankSlipPopBox(prevState => ({
										...prevState,
										...res.data.data,
										depositTime: `${moment().format(
											"yyyy-MM-DDT"
										)}${moment().format("HH:mm")}`,
										isOpen: true,
										amount: number_format(
											real_amount,
											_isConvert
										),
										closeCallBack: () =>
											setRedirectPath(
												`/${path.deposit.root}`
											)
									}));

									setPopBox(prevState => ({
										...prevState,
										isOpen: false
									}));
								} else {
									setPopBox(prevState => ({
										...prevState,
										title: i18n.lbl_ImportantNote,
										content: i18n.msg_WrongAmount
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
				};

				const openConfirmPopBox = () => {
					let real_amount = _isConvert
						? Number(amount) * 1000
						: Number(amount);
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: (
							<>
								<p>{i18n.lbl_ConfirmDeposit}</p>
								<img
									src={`${config.imgUrl}/common/images/BankLogo/${selBank.bank.image}`}
									alt={selBank.bank.bankName}
								/>
								<div className="tip">
									<span>{i18n.lbl_DepositAmount} :</span>{" "}
									{number_format(real_amount, _isConvert)}
								</div>
							</>
						),
						hasBtn: true,
						btnBar: (
							<div className="btn-group">
								<button
									className="blue"
									onClick={() =>
										setPopBox(prevState => ({
											...prevState,
											isOpen: false
										}))
									}>
									{i18n["lbl_Cancel"]}
								</button>
								<button
									className="orange"
									onClick={RedirectToNext.bind(
										this,
										real_amount,
										selBank.bank.id
									)}>
									{i18n["lbl_Submit"]}
								</button>
							</div>
						)
					});
				};

				const setAccountName = () => {
					api_SetAccountName({ name: accountName }).then(
						res => {
							if (isMountedRef.current) {
								if (res.data.errorCode === 0) {
									openConfirmPopBox();
								} else {
									setPopBox(prevState => ({
										...prevState,
										title: i18n.lbl_ImportantNote,
										content: res.data.message,
										hasBtn: true,
										btnBar: (
											<div className="btn-group">
												<button
													className="blue"
													onClick={() =>
														setPopBox(
															prevState => ({
																...prevState,
																isOpen: false
															})
														)
													}>
													{i18n["lbl_Cancel"]}
												</button>
											</div>
										)
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
				};

				if (!userInfo.accountName) {
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ConfirmRealNameAlert,
						hasBtn: true,
						btnBar: (
							<div className="btn-group">
								<button
									className="blue"
									onClick={() =>
										setPopBox(prevState => ({
											...prevState,
											isOpen: false
										}))
									}>
									{i18n["lbl_Cancel"]}
								</button>
								<button
									className="orange"
									onClick={setAccountName}>
									{i18n["lbl_Submit"]}
								</button>
							</div>
						)
					});
				} else {
					openConfirmPopBox();
				}
			} else {
				setWarning({
					accountName: {
						status: !accountName,
						msg: !accountName ? i18n.msg_EnterRealName : ""
					},
					amount: {
						status: !amount,
						msg: !amount ? i18n.lbl_AmountTooltip : ""
					}
				});
				VaildAmount(amount);
			}
		}
	};

	if (loading) {
		return <Loading />;
	} else {
		return redirectPath !== null ? (
			<Redirect to={redirectPath} noThrow />
		) : pageVerify ? (
			<>
				<Step step={3} total={2} />
				<div className="inputBox">
					<DropdownIMG
						mainKey={"localBank-bankList"}
						onSelectItem={SelectBank}
						options={bankList}
						selectedIdx={selBank?.idx}
						i18n={i18n}
						ImgURL={`${config.imgUrl}/common/images/BankLogo/`}
						className="bankLogo"
					/>
					<LimitTip
						displayTextLimit={i18n.lbl_Limit}
						displayTextUnLimit={i18n.lbl_Unlimited}
						minAmount={selBank?.bank?.minAmount}
						maxAmount={selBank?.bank?.maxAmount}
						_isConvert={_isConvert}
					/>
				</div>
				{!userInfo.accountName ? (
					<InputBox
						icon="icon-member"
						placeholder={i18n["lbl_RealName"]}
						value={accountName}
						onChange={EditField.bind(this, "accountName")}
						Warning={warning.accountName}
					/>
				) : (
					<></>
				)}
				<InputBox
					icon="icon-pencil"
					placeholder={i18n["lbl_Amount"]}
					value={amount}
					inputType="tel"
					onChange={EditField.bind(this, "amount")}
					Warning={warning.amount}
				/>
				<Promotion />
				<div className="btn-group">
					<Link to="../" className="white">
						{i18n.lbl_Back}
					</Link>
					<button className="orange" onClick={ClickSubmit}>
						{i18n.lbl_Submit}
					</button>
				</div>
			</>
		) : (
			<></>
		);
	}
};
