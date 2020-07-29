import React, { useContext, useState, useEffect, useRef } from "react";
import Step from "./step";
import { Link, Redirect } from "@reach/router";
import {
	i18nContext,
	userInfoContext,
	popBoxContext
} from "../../components/common/context";
import {
	api_GetMobilePayGroupList,
	api_GetMobilePayInfoList
} from "../../service/api/payment";
import config from "../../config";
import LimitTip from "./limitTip";
import { isConvert } from "../common/common";
import path from "../../path";
import PageVerify from "./deposit.pageVerify";
import Loading from "../common/loading";

export const Panel = props => props.children;

export const Main = props => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const [paymentList, setPaymentList] = useState([]);
	const [selGroupId, setSelGroupId] = useState(null);
	const [channelList, setChannelList] = useState([]);
	const { setPopBox } = useContext(popBoxContext);

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

	const _isConvert = isConvert(userInfo.currencyId);
	useEffect(() => {
		if (props.location.state?.paymentList) {
			if (isMountedRef.current) {
				setLoading(false);
				setPaymentList(props.location.state.paymentList);
			}
		} else {
			if (userInfo.isLogin) {
				setLoading(true);
				api_GetMobilePayGroupList().then(
					res => {
						if (isMountedRef.current) {
							if (res.data.errorCode === 0) {
								if (res.data.data.length > 0) {
									setPaymentList(res.data.data);
								} else {
									setRedirectPath(`/${path.deposit.root}`);
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
							setLoading(false);
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: i18n.msg_ApiServerError
							});
						}
					}
				);
			}
		}
	}, [
		props.location.state,
		setPopBox,
		i18n.lbl_ImportantNote,
		userInfo.isLogin,
		i18n.msg_ApiServerError
	]);

	const SelectPayment = groupId => {
		if (pageVerify && selGroupId !== groupId) {
			setSelGroupId(() => groupId);
			setLoading(true);
			api_GetMobilePayInfoList(groupId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setChannelList(res.data.data);
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
	};

	let rows = paymentList?.map(p => {
		return (
			<div key={`deposit-mobilepay-${p.groupId}`}>
				<button
					className={`icon icon-${p.groupName}${
						selGroupId === p.groupId ? " switch open" : ""
					}`}
					onClick={SelectPayment.bind(this, p.groupId)}></button>
				<span>{p.groupName}</span>
			</div>
		);
	});

	let channels = channelList?.map(c => {
		return (
			<Link
				className="account"
				key={`deposit-mobilepay-${c.channelId}`}
				to={`${c.channelName.replace(" ", "")}`}
				state={{
					...c
				}}>
				<div className="bankLogo">
					<img
						src={`${config.imgUrl}/common/images/MobilePay/${c.groupName}.png`}
						alt={c.groupName}
					/>
				</div>
				<div className="info">
					<ul>
						<li>
							<span className="title">{c.channelName}</span>
							<LimitTip
								minAmount={c.minAmount}
								maxAmount={c.maxAmount}
								displayTextLimit={i18n.lbl_Unlimited}
								displayTextUnLimit={i18n.lbl_Limit}
								_isConvert={_isConvert}
							/>
						</li>
					</ul>
				</div>
			</Link>
		);
	});

	if (loading) {
		return <Loading />;
	} else {
		return redirectPath !== null ? (
			<Redirect to={redirectPath} noThrow />
		) : pageVerify ? (
			<>
				<Step step={2} />
				<div className="depositType">{rows}</div>
				<div
					className={`inputBox channel${
						selGroupId !== null ? " open" : ""
					}`}>
					{channels}
				</div>
				<div className="btn-group">
					<Link to="../" className="white">
						{i18n.lbl_Back}
					</Link>
				</div>
			</>
		) : (
			<></>
		);
	}
};
