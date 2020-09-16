import React, { useContext, useEffect, useState, useRef } from "react";
import moment from "moment";
import { number_format, isConvert } from "../common/common";
import Step from "./step";
import {
	i18nContext,
	popBoxContext,
	bankSlipPopBoxContext,
	userInfoContext
} from "../common/context";
import { Link, Redirect } from "@reach/router";
import {
	api_GetOnlinePaymentList,
	api_GetBankInfoOffList,
	api_GetMobilePayGroupList,
	api_GetDepositInfoRecent,
	api_SetDepositCancel
} from "../../service/api/payment";
import RecentDatas from "./deposit.recentDatas";
import Loading from "../common/loading";
import PageVerify from "./deposit.pageVerify";

const defPayType = {
	onlineBank: "onlineBank",
	localBank: "localBank",
	mobilePay: "mobilePay"
};

const defPayment = {
	[defPayType.onlineBank]: {
		icon: "icon icon-connection",
		displayKey: "lbl_OnlineBanking",
		creditTimeKey: "lbl_Instant"
	},
	[defPayType.localBank]: {
		icon: "icon icon-credit-card",
		displayKey: "lbl_WireTransfers",
		creditTimeKey: "lbl_5mins"
	},
	[defPayType.mobilePay]: {
		icon: "icon icon-mobile",
		displayKey: "lbl_MobileDeposit",
		creditTimeKey: "lbl_5mins"
	}
};

const Panel = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const { setbankSlipPopBox } = useContext(bankSlipPopBoxContext);
	const [allowPayment, setAllowPayment] = useState({
		[defPayType.onlineBank]: false,
		[defPayType.localBank]: false,
		[defPayType.mobilePay]: false
	});

	const [onlineBankingList, setOnlineBankingList] = useState([]);
	const [localBankList, setLocalBankList] = useState([]);
	const [mobilePayList, setMobilePayList] = useState([]);
	const [recentDatas, setRecentDatas] = useState([]);

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
		false
	);

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(null);
		}
	}, [redirectPath]);

	useEffect(() => {
		if (userInfo.isLogin) {
			setLoading(true);

			api_GetOnlinePaymentList().then(
				res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						setOnlineBankingList(res.data.data);
						setAllowPayment(prevState => ({
							...prevState,
							[defPayType.onlineBank]:
								res.data.data && res.data.data.length > 0
						}));
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setLoading(false);
					}
				}
			);

			api_GetBankInfoOffList().then(
				res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						setLocalBankList(res.data.data);
						setAllowPayment(prevState => ({
							...prevState,
							[defPayType.localBank]:
								res.data.data && res.data.data.length > 0
						}));
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setLoading(false);
					}
				}
			);

			api_GetMobilePayGroupList().then(
				res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						setMobilePayList(res.data.data);
						setAllowPayment(prevState => ({
							...prevState,
							[defPayType.mobilePay]:
								res.data.data && res.data.data.length > 0
						}));
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setLoading(false);
					}
				}
			);

			api_GetDepositInfoRecent().then(res => {
				if (res.data.errorCode === 0 && isMountedRef.current) {
					setRecentDatas(res.data.data);
				}
			});
		}
	}, [userInfo.isLogin]);

	const _isConvert = isConvert(userInfo.currencyId);
	const SubmitProof = (
		bankInfo,
		depositRep,
		amount,
		transId,
		picFileName,
		refId
	) => {
		if (pageVerify) {
			let { currencyId, ...restBankInfo } = bankInfo;
			let { accountName, accountNo } = depositRep;
			setbankSlipPopBox(() => ({
				depositTime: `${moment().format(
					"yyyy-MM-DDT"
				)}${moment().format("HH:mm")}`,
				...restBankInfo,
				transId: transId,
				accountNo: accountNo,
				accountName: accountName,
				isOpen: true,
				amount: number_format(amount, _isConvert),
				picFileName: picFileName,
				refId: refId
			}));
		}
	};

	const ClickCancel = transId => {
		if (pageVerify) {
			const ClickSubmit = () => {
				setPopBox({ isOpen: false });
				api_SetDepositCancel(transId).then(
					res => {
						if (isMountedRef.current) {
							if (res.data.errorCode === 0) {
								api_GetDepositInfoRecent().then(res => {
									if (res.data.errorCode === 0) {
										setRecentDatas(res.data.data);
									}
								});
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

			const ClickCancel = () => {
				setPopBox({ isOpen: false });
			};

			setPopBox({
				isOpen: true,
				title: "",
				content: i18n["lbl_CancelConfirm"],
				hasBtn: true,
				btnBar: (
					<div className="btn-group">
						<button className="blue" onClick={ClickCancel}>
							{i18n["lbl_Cancel"]}
						</button>
						<button className="orange" onClick={ClickSubmit}>
							{i18n["lbl_Submit"]}
						</button>
					</div>
				)
			});
		}
	};

	const paymentList = pageVerify
		? Object.keys(defPayment)
				.filter(key => {
					return allowPayment[key];
				})
				.map(key => {
					let item = defPayment[key];
					let list = [];
					if (key === defPayType.onlineBank) {
						list = onlineBankingList;
					} else if (key === defPayType.localBank) {
						list = localBankList;
					} else if (key === defPayType.mobilePay) {
						list = mobilePayList;
					}
					return (
						<div key={`deposit-${key}`}>
							<Link
								to={key}
								className={item.icon}
								state={{
									paymentList: list
								}}
							/>
							<span>{i18n[item.displayKey]}</span>
							<span className="title">{i18n.lbl_CreditTime}</span>
							<span className="creditTime">
								{i18n[item.creditTimeKey]}
							</span>
						</div>
					);
				})
		: null;

	const GetDepositInfoRecent = () => {
		api_GetDepositInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setRecentDatas(res.data.data);
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

	return redirectPath === null ? (
		loading ? (
			<Loading />
		) : (
			<>
				<Step step={1} />
				<div className="depositType">{paymentList}</div>
				<RecentDatas
					Datas={recentDatas}
					SubmitProof={SubmitProof}
					ClickCancel={ClickCancel}
					GetDepositInfoRecent={GetDepositInfoRecent}
				/>
			</>
		)
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};

export default Panel;
