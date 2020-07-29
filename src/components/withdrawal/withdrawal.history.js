import React, { useState, useContext, useEffect, useRef } from "react";
import { i18nContext, popBoxContext, userInfoContext } from "../common/context";
import {
	api_GetWithdrawalInfoHistory,
	api_SetWithdrawalCancel
} from "../../service/api/payment";
import { number_format, isConvert } from "../common/common";
import moment from "moment";
import HistoryFilter from "../common/historyFilter";
import AUTO_FETCHING_DATA from "../../service/autoFetchingData";
import ReloadSpin from "../common/reloadSpin";
import Loading from "../common/loading";

const Panel = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistoryState, setGetHistoryState] = useState(null);
	const [filterData, setFilterData] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pageInfo, setPageInfo] = useState({ pageNumber: 0, totalPages: 0 });
	const isMountedRef = useRef(null);
	const [clickSubmit, setClickSubmit] = useState(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});
	AUTO_FETCHING_DATA(
		api_GetWithdrawalInfoHistory,
		filterData,
		pageInfo,
		setGetHistoryState,
		setPageInfo,
		setPopBox,
		processing,
		setProcessing,
		clickSubmit
	);

	const submitHandler = (startDay, endDay, isUnix) => {
		setLoading(true);

		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;
			if (!isUnix) {
				transactionData = {
					StartDate: moment(startDay).unix(),
					EndDate: moment(endDay).endOf("day").unix()
				};
				setFilterData(transactionData);
			}

			setClickSubmit(true);
			api_GetWithdrawalInfoHistory({
				...transactionData,
				PageNumber: 1
			}).then(
				response => {
					if (isMountedRef.current) {
						const errorCode = response.data.errorCode;
						if (errorCode !== 0) {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: response.data.message
							});
						} else {
							setGetHistoryState(response.data.data);
							if (
								response.data.totalPages >=
								response.data.pageNumber
							) {
								setPageInfo(() => ({
									totalPages: response.data.totalPages,
									pageNumber: response.data.pageNumber
								}));
							}
						}
						setProcessing(false);
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
						setProcessing(false);
						setLoading(false);
					}
				}
			);
		}
	};

	const ClickCancel = transId => {
		const ClickSubmit = () => {
			setPopBox({ isOpen: false });
			api_SetWithdrawalCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setGetHistoryState(prevState => {
								let newD = [...prevState];
								let idx = newD.findIndex(
									x => x.transId === transId
								);
								newD[idx].status = 5;
								return newD;
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
						setProcessing(false);
					}
				}
			);
		};

		const ClickCancel = () => {
			setPopBox({ isOpen: false });
		};

		setPopBox({
			isOpen: true,
			title: i18n.lbl_ImportantNote,
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
	};

	let arr = getHistoryState?.map(item => {
		return (
			<TransactionHistory
				key={`withdrawalHistory-${item.transId}`}
				createTime={item.createTime}
				transId={item.transId}
				amount={item.amount}
				status={item.status}
				_isConvert={_isConvert}
				ClickCancel={ClickCancel.bind(this, item.transId)}
			/>
		);
	});

	return (
		<>
			<HistoryFilter submitHandler={submitHandler} />
			{loading ? (
				<Loading />
			) : (
				<>
					{getHistoryState ? (
						<div className="recent open">
							<div className="recentTransactions">
								<div className="smallTitle">
									<i className="icon icon-history"></i>
									{i18n["lbl_TransactionHistory"]}
								</div>
								<ReloadSpin
									func={submitHandler.bind(
										this,
										filterData?.StartDate,
										filterData?.EndDate,
										true
									)}
								/>
							</div>
							{getHistoryState.length > 0 ? (
								<div className="infoList">{arr}</div>
							) : (
								<div className="not-found">
									{i18n["msg_NoData"]}
								</div>
							)}{" "}
						</div>
					) : null}
				</>
			)}
		</>
	);
};

export const TransactionHistory = props => {
	const { i18n } = useContext(i18nContext);

	let btnGroup = null;
	if (props.status === 1) {
		btnGroup = (
			<div className="btn-group">
				<button className="blue" onClick={props.ClickCancel}>
					{i18n.lbl_Cancel}
				</button>
			</div>
		);
	}
	return (
		<div className="info">
			<ul>
				<li>
					<span className="title">{i18n["lbl_Date"]}</span>
					<span>
						{moment(props.createTime).format("MM/DD/YYYY(Z)")}
					</span>
				</li>
				<li>
					<span className="title">{i18n["lbl_Time"]}</span>
					<span>{moment(props.createTime).format("hh:mm:ss A")}</span>
				</li>
				<li>
					<span className="title">{i18n["lbl_ID"]}</span>
					<span>{props.transId}</span>
				</li>
				<li>
					<span className="title">{i18n["lbl_Amount"]}</span>
					<span>{number_format(props.amount, props._isConvert)}</span>
				</li>
				<li>
					<span className="title">{i18n["lbl_Status"]}</span>
					<span>{i18n[`lbl_WithdrawalStatus${props.status}`]}</span>
				</li>
			</ul>
			{btnGroup}
		</div>
	);
};

export default Panel;
