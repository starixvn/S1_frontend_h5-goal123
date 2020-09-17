import React, { useContext, useState, useEffect, useRef } from "react";
import {
	i18nContext,
	userInfoContext,
	popBoxContext
} from "../../components/common/context";
import Step from "./step";
import config from "../../config";
import LimitTip from "./limitTip";
import { isConvert, number_format, checkAmount } from "../common/common";
import { Link, Redirect } from "@reach/router";
import InputBox from "../common/inputbox";
import path from "../../path";
import PageVerify from "./deposit.pageVerify";

const SetMobilePay = props => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	const [amount, setAmount] = useState(() => {
		return props.location.state?.amountRule === 3 ? 0 : "";
	});
	const [warning, setWarning] = useState({ status: false, msg: "" });
	const [redirectPath, setRedirectPath] = useState(null);

	const _isConvert = isConvert(userInfo.currencyId);
	const paymentInfo = props.location.state;

	const [pageVerify, setPageVerify] = useState(true);

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
		if (isMountedRef.current && props.location.state === null) {
			redirectPath(`/${path.deposit.root}`);
		}
	}, [props.location.state, redirectPath]);

	const VaildAmount = _amount => {
		let result = checkAmount(
			_amount,
			paymentInfo.minAmount,
			paymentInfo.maxAmount,
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
		if (pageVerify) {
			let confirmAmount =
				paymentInfo.amountRule === 3 &&
				paymentInfo.amountList?.length > 0
					? amount / 1000
					: amount;

			let result = VaildAmount(confirmAmount);

			if (result) {
				const RedirectToNext = real_amount => {
					setPopBox(prevState => ({
						...prevState,
						isOpen: false
					}));
					setRedirectPath(`/${path.deposit.root}`);
					window.open(
						`${config.openURL}/${userInfo.langId}/Cashier/DepositReqMobilePay?ChannelId=${paymentInfo.channelId}&Amount=${real_amount}`
					);
				};

				let real_amount = _isConvert
					? confirmAmount * 1000
					: confirmAmount;
				setPopBox({
					isOpen: true,
					title: i18n.lbl_ImportantNote,
					content: (
						<>
							<p>{i18n.lbl_ConfirmDeposit}</p>
							<img
								src={`${config.imgUrl}/common/images/MobilePay/${paymentInfo.groupName}.png`}
								alt={paymentInfo.groupName}
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
									real_amount
								)}>
								{i18n["lbl_Submit"]}
							</button>
						</div>
					)
				});
			}
		}
	};

	const OnSelectAmount = value => {
		if (amount !== value) {
			setAmount(() => value);
		}
	};

	let amountBtn = paymentInfo?.amountList?.map(a => {
		return (
			<button
				className={amount === a ? "open" : ""}
				key={`deposit-mobilepay-${paymentInfo.groupId}-${paymentInfo.channelId}-${a}`}
				onClick={OnSelectAmount.bind(this, a)}>
				<i className="icon icon-checkmark"></i>
				{number_format(a, _isConvert)}
			</button>
		);
	});

	return redirectPath !== null ? (
		<Redirect to={redirectPath} noThrow />
	) : (
		<>
			<Step step={3} />
			<div className="inputBox">
				<div className="account">
					<div className="bankLogo">
						<img
							src={`${config.imgUrl}/common/images/MobilePay/${paymentInfo.groupName}.png`}
							alt={paymentInfo.groupName}
						/>
					</div>
					<div className="info">
						<ul>
							<li>
								<span className="title">Zalo</span>
								<LimitTip
									minAmount={paymentInfo.minAmount}
									maxAmount={paymentInfo.maxAmount}
									displayTextLimit={i18n.lbl_Unlimited}
									displayTextUnLimit={i18n.lbl_Limit}
									_isConvert={_isConvert}
								/>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{amountBtn &&
			amountBtn.length > 0 &&
			paymentInfo.amountRule === 3 ? (
				<>
					<span className="infoStates">
						{number_format(amount, _isConvert)}
					</span>
					<div className="buttonBox">{amountBtn}</div>
				</>
			) : (
				<InputBox
					icon="icon-pencil"
					value={amount}
					inputType="tel"
					onChange={EditAmount}
					Warning={warning}
				/>
			)}
			<div className="btn-group">
				<Link to="../" className="white">
					{i18n.lbl_Back}
				</Link>
				<button className="orange" onClick={ClickSubmit}>
					{i18n.lbl_Submit}
				</button>
			</div>
		</>
	);
};

export default SetMobilePay;
