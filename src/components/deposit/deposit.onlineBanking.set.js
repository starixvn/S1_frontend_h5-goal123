import React, { useEffect, useState, useContext, useRef } from "react";
import Step from "./step";
import { i18nContext, userInfoContext, popBoxContext } from "../common/context";
import { Link, Redirect } from "@reach/router";
import {
	api_GetOnlineBankInfoSysList,
	api_GetOnlineBankInfo
} from "../../service/api/payment";
import DropdownIMG from "../common/dropdown.image";
import config from "../../config";
import { number_format, isConvert, checkAmount } from "../common/common";
import InputBox from "../common/inputbox";
import LimitTip from "./limitTip";
import path from "../../path";
import PageVerify from "./deposit.pageVerify";
import Loading from "../common/loading";

const SetPayment = props => {
	const { setPopBox } = useContext(popBoxContext);
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);

	const [redirectPath, setRedirectPath] = useState(null);
	const [bankList, setBankList] = useState([]);
	const [selBank, setSelBank] = useState({
		idx: null,
		bank: null
	});
	const [amount, setAmount] = useState("");
	const [warning, setWarning] = useState({ status: false, msg: "" });
	const _isConvert = isConvert(userInfo.currencyId);

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
		props.location.state !== null
	);

	useEffect(() => {
		if (props.location.state === null) {
			if (isMountedRef.current) {
				setRedirectPath(`/${path.deposit.root}`);
				setLoading(false);
			}
		} else {
			if (userInfo.isLogin) {
				setLoading(true);
				api_GetOnlineBankInfoSysList({
					payId: props.location.state.payId
				}).then(
					res => {
						if (res.data.errorCode === 0) {
							let datas = res.data.data.map(b => {
								let { bankLogo, sysId, bankName, ...rest } = b;
								return {
									...rest,
									image: bankLogo,
									id: sysId,
									displayText: bankName
								};
							});

							if (isMountedRef.current) {
								if (datas.length > 0) {
									setBankList(datas);
								} else {
									setRedirectPath(`/${path.deposit.root}`);
								}
							}
						} else {
							if (isMountedRef.current) {
								setPopBox({
									isOpen: true,
									title: i18n.lbl_ImportantNote,
									content: res.data.message
								});
							}
						}

						if (isMountedRef.current) {
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
		}
	}, [
		props.location.state,
		userInfo.isLogin,
		i18n.lbl_ImportantNote,
		setPopBox,
		i18n.msg_ApiServerError
	]);

	const SelectBank = idx => {
		if (pageVerify) {
			api_GetOnlineBankInfo({
				payId: props.location.state.payId,
				sysId: bankList[idx].id
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setSelBank({
								idx: idx,
								bank: res.data.data
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
		}
	};

	const VaildAmount = _amount => {
		let result = checkAmount(
			_amount,
			selBank.bank.minAmount,
			selBank.bank.maxAmount,
			_isConvert,
			i18n
		);
		if (result.status !== 0) {
			setWarning({
				status: true,
				msg: result.msg
			});
		} else {
			setWarning({
				status: false,
				msg: ""
			});
		}
		return result.status === 0;
	};

	const EditAmount = e => {
		let value = e.target.value;
		VaildAmount(value);
		setAmount(value);
	};

	const ClickSubmit = () => {
		let result = VaildAmount(amount);

		if (result) {
			const RedirectToNext = real_amount => {
				window.open(
					`${config.openURL}/${userInfo.langId}/Cashier/DepositReqOnlineBanking` +
						"?sysId=" +
						selBank.bank.sysId +
						"&payId=" +
						selBank.bank.payId +
						"&ChannelId=" +
						selBank.bank.channelId +
						"&Amount=" +
						real_amount
				);
				setPopBox(prevState => ({
					...prevState,
					isOpen: false
				}));
				setRedirectPath(`/${path.deposit.root}`);
			};

			let real_amount = _isConvert ? amount * 1000 : amount;
			setPopBox({
				isOpen: true,
				title: i18n.lbl_ImportantNote,
				content: (
					<>
						<p>{i18n.lbl_ConfirmDeposit}</p>
						<img
							src={`${config.imgUrl}/common/images/BankLogo/${selBank.bank.bankLogo}`}
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
							onClick={RedirectToNext.bind(this, real_amount)}>
							{i18n["lbl_Submit"]}
						</button>
					</div>
				)
			});
		}
	};

	if (loading) {
		return <Loading />;
	} else {
		return redirectPath !== null ? (
			<Redirect to={redirectPath} noThrow />
		) : pageVerify ? (
			<>
				<Step step={3} />
				<div className="inputBox">
					<DropdownIMG
						mainKey={"onlineBanking-bankList"}
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
						_isConvert={_isConvert}
						minAmount={selBank?.bank?.minAmount}
						maxAmount={selBank?.bank?.maxAmount}
					/>
				</div>
				<InputBox
					icon="icon-pencil"
					value={amount}
					inputType="tel"
					onChange={EditAmount}
					Warning={warning}
				/>
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

export default SetPayment;
