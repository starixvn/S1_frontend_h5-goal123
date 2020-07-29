import React, { useState, useContext, useRef, useEffect } from "react";
import { i18nContext, popBoxContext, userInfoContext } from "../common/context";
import { api_GetTransferHistory } from "../../service/api/tp";
import { number_format, isConvert } from "../common/common";
import ReloadSpin from "../common/reloadSpin";
import moment from "moment";
import HistoryFilter from "../common/historyFilter";
import AUTO_FETCHING_DATA from "../../service/autoFetchingData";
import Loading from "../common/loading";

const transferDirection = (direction, displayMainWallet, displaySabaWallet) => {
	let startWallet = "";
	let endWallet = "";

	if (direction === 1) {
		startWallet = displayMainWallet;
		endWallet = displaySabaWallet;
	} else {
		startWallet = displaySabaWallet;
		endWallet = displayMainWallet;
	}
	return { startWallet, endWallet };
};

const Panel = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistoryState, setGetHistoryState] = useState(null);
	const [filterData, setFilterData] = useState(null);
	const [pageInfo, setPageInfo] = useState({ pageNumber: 0, totalPages: 0 });
	const [processing, setProcessing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [clickSubmit, setClickSubmit] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	AUTO_FETCHING_DATA(
		api_GetTransferHistory,
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
			api_GetTransferHistory({
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
							if (isMountedRef.current) {
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

	let arr = getHistoryState?.map(item => {
		const _transferDirection = transferDirection(
			item.direction,
			i18n.lbl_MainWallet,
			i18n.lbl_Wallet_Saba
		);
		return (
			<TransactionHistory
				key={`transferHistory-${item.transId}`}
				createTime={item.createTime}
				transId={item.transId}
				_isConvert={_isConvert}
				amount={item.amount}
				startWallet={_transferDirection.startWallet}
				endWallet={_transferDirection.endWallet}
				i18n={i18n}
				className="info transfer"
				memo={item.memo}
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
	return (
		<div className={props.className}>
			<ul>
				<li>
					<span className="title">{props.i18n["lbl_Date"]}</span>
					<span>
						{moment(props.createTime).format("MM/DD/YYYY(Z)")}
					</span>
				</li>
				<li>
					<span className="title">{props.i18n["lbl_Time"]}</span>
					<span>{moment(props.createTime).format("hh:mm:ss A")}</span>
				</li>
				<li>
					<span className="title">{props.i18n["lbl_ID"]}</span>
					<span>{props.transId}</span>
				</li>
				<li>
					<span className="title">{props.i18n["lbl_Amount"]}</span>
					<span>{number_format(props.amount, props._isConvert)}</span>
				</li>
				<li>
					<span className="title">{props.i18n["lbl_Direction"]}</span>
					<span>
						<span>{props.startWallet}</span> >
						<span>{props.endWallet}</span>
					</span>
				</li>
				<li>
					<span className="title">{props.i18n["lbl_Memo"]}</span>
					<span>
						<span>{props.memo}</span>
					</span>
				</li>
			</ul>
			<div className="btn-group"></div>
		</div>
	);
};

export default Panel;
