import React, { useEffect, useState, useContext, useRef } from "react";
import { i18nContext, popBoxContext, msgCountContext } from "../common/context";
import {
	api_GetMsgList,
	api_GetMsgContent,
	api_DelMsg,
	api_GetMsgCount
} from "../../service/api/account";
import moment from "moment";
import ReloadSpin from "../common/reloadSpin";
import Loading from "../common/loading";

import AUTO_FETCHING_DATA from "../../service/autoFetchingData";

const Panel = () => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const { setMsgCount } = useContext(msgCountContext);
	const [getMsgList, setGetMsgList] = useState([]);
	const [getMsgContent, setGetMsgContent] = useState([]);
	const [openContentState, setOpenContentState] = useState(null);
	const [checkboxListState, setcheckboxListState] = useState([]);
	const [isSelectedAll, setIsSelectedAll] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pageInfo, setPageInfo] = useState({ pageNumber: 0, totalPages: 0 });
	const isMountedRef = useRef(null);

	AUTO_FETCHING_DATA(
		api_GetMsgList,
		{},
		pageInfo,
		setGetMsgList,
		setPageInfo,
		setPopBox,
		processing,
		setProcessing,
		true
	);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		isMountedRef.current = true;
		setLoading(true);
		api_GetMsgList({ PageNumber: 1 }).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let data = res.data.data;
						if (data !== null) {
							setGetMsgList(data);

							if (res.data.totalPages >= res.data.pageNumber) {
								setPageInfo(() => ({
									totalPages: res.data.totalPages,
									pageNumber: res.data.pageNumber
								}));
							}
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
	}, [i18n.lbl_ImportantNote, i18n.msg_ApiServerError, setPopBox]);

	const GetMsgList = () => {
		if (!processing) {
			setProcessing(true);
			api_GetMsgList({ PageNumber: 1 }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							let data = res.data.data;
							if (data !== null) {
								setGetMsgList(data);
								if (
									res.data.totalPages >= res.data.pageNumber
								) {
									setPageInfo(() => ({
										totalPages: res.data.totalPages,
										pageNumber: res.data.pageNumber
									}));
								}
							}
						} else {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message
							});
						}
						setProcessing(false);
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
		}
	};

	const openContent = (id, flag) => {
		if (!processing) {
			setProcessing(true);

			if (openContentState === id) {
				setOpenContentState(null);
				setProcessing(false);
			} else {
				api_GetMsgContent(id).then(
					res => {
						if (isMountedRef.current) {
							if (res.data.errorCode === 0) {
								let data = res.data.data;
								setGetMsgContent(data);

								if (!flag) {
									setGetMsgList(prevState => {
										return prevState.map(x => {
											if (x.id === id) {
												x.flag = true;
											}
											return x;
										});
									});

									api_GetMsgCount().then(
										res => {
											if (isMountedRef.current) {
												if (res.data.errorCode === 0) {
													setMsgCount(res.data.data);
												} else {
													setPopBox({
														isOpen: true,
														title:
															i18n.lbl_ImportantNote,
														content:
															res.data.message
													});
												}
											}
										},
										err => {
											if (isMountedRef.current) {
												setPopBox({
													isOpen: true,
													title:
														i18n.lbl_ImportantNote,
													content:
														i18n.msg_ApiServerError
												});
											}
										}
									);
								}
							} else {
								setPopBox({
									isOpen: true,
									title: i18n.lbl_ImportantNote,
									content: res.data.message
								});
							}
							setProcessing(false);
							setOpenContentState(id);
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
			}
		}
	};

	const checkboxHandler = item => {
		let currIds = checkboxListState.includes(item.id)
			? checkboxListState.filter(_item => _item !== item.id)
			: [...checkboxListState, item.id];
		setcheckboxListState(currIds);
		setIsSelectedAll(currIds.length === getMsgList.length);
	};

	const selectAll = () => {
		let allId = getMsgList.map(item => {
			return item.id;
		});
		if (checkboxListState.length === getMsgList.length) {
			setcheckboxListState([]);
			setIsSelectedAll(false);
		} else {
			setcheckboxListState(allId);
			setIsSelectedAll(true);
		}
	};

	const delMsg = () => {
		const DelMsg = () => {
			api_DelMsg(checkboxListState).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setGetMsgList(prevState =>
								prevState.filter(m => {
									return !checkboxListState.includes(m.id);
								})
							);
							setcheckboxListState([]);
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
			setPopBox({ isOpen: false });
		};

		const closePopBox = () => {
			setPopBox({ isOpen: false });
		};

		if (checkboxListState.length !== 0) {
			setPopBox({
				isOpen: true,
				title: "",
				content: i18n["lbl_CheckConfirm"],
				hasBtn: true,
				btnBar: (
					<div className="btn-group">
						<button className="blue" onClick={closePopBox}>
							{i18n["lbl_Cancel"]}
						</button>
						<button className="orange" onClick={DelMsg}>
							{i18n["lbl_Submit"]}
						</button>
					</div>
				)
			});
		}
	};

	let arr = getMsgList?.map(item => {
		let _open = openContentState === item.id;
		let _checked = checkboxListState.includes(item.id);

		return (
			<Item
				key={`msgList-${item.id}`}
				showDate={item.createTime}
				title={item.title}
				onClick={openContent.bind(null, item.id, item.flag)}
				content={getMsgContent.content}
				isOpen={_open}
				isRead={item.flag}
				onChange={checkboxHandler.bind(null, item)}
				isChecked={_checked}
			/>
		);
	});

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<div className="functionList">
						<label className="checkbox">
							<input type="checkbox" onChange={selectAll} />
							<i
								className={`icon icon-checkbox ${
									isSelectedAll ? "open" : ""
								}`}></i>
							{i18n["lbl_SelectAll"]}
						</label>
						<div className="smallBtn-group">
							<button
								className="icon icon-bin clickBtn"
								onClick={delMsg}></button>
							<ReloadSpin func={GetMsgList} />
						</div>
					</div>
					{getMsgList.length > 0 ? (
						<>{arr}</>
					) : (
						<div className="not-found">{i18n["msg_NoData"]}</div>
					)}
				</>
			)}
		</>
	);
};

const Item = props => {
	return (
		<div className={`account ${props.isRead ? " read" : ""}`}>
			<div className="info">
				<label className="checkbox">
					<input type="checkbox" onChange={props.onChange} />
					<i
						className={`icon icon-checkbox${
							props.isChecked ? " open" : ""
						}`}></i>
				</label>
				<div className="introduction">
					<span className="title">{props.title}</span>
					<span>
						{moment(props.showDate).format("MM/DD/YYYY h:mm:ss A")}
					</span>
				</div>
				<button
					className={`icon icon-circle-right ${
						props.isOpen ? " open" : ""
					}`}
					onClick={props.onClick}></button>
			</div>
			<div className={`content ${props.isOpen ? " open" : ""}`}>
				<pre>{props.content}</pre>
			</div>
		</div>
	);
};

export default Panel;
