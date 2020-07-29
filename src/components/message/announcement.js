import React, { useContext, useEffect, useState } from "react";
import { userInfoContext, popBoxContext, i18nContext } from "../common/context";
import { api_GetAnnouncement } from "../../service/api/message";
import moment from "moment";
import Loading from "../common/loading";

const Panel = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [getAnnouncement, setGetAnnouncement] = useState([]);
	const [selectItemState, setSelectItemState] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			setLoading(true);
		}

		api_GetAnnouncement(userInfo.langId).then(
			res => {
				if (res.data.errorCode === 0) {
					const data = res.data.data;
					if (mounted) {
						setGetAnnouncement(data);
					}
				} else {
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: res.data.message
					});
				}

				if (mounted) {
					setLoading(false);
				}
			},
			err => {
				if (mounted) {
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ApiServerError
					});
					setLoading(false);
				}
			}
		);
	}, [
		i18n.lbl_ImportantNote,
		i18n.msg_ApiServerError,
		setPopBox,
		userInfo.langId
	]);

	const openItem = id => {
		if (selectItemState === id) {
			setSelectItemState(null);
		} else {
			setSelectItemState(id);
		}
	};

	let arr = getAnnouncement?.map(item => {
		let _open = selectItemState === item.id;
		return (
			<Item
				key={`announcement-${item.id}`}
				showTime={item.startTime}
				subject={item.subject}
				content={item.content}
				onClick={openItem.bind(null, item.id)}
				isOpen={_open}
			/>
		);
	});

	return (
		<>
			{loading ? <Loading /> : null}
			<div className="functionList"></div>
			{arr}
		</>
	);
};

const Item = props => {
	return (
		<div className="account">
			<div className="info">
				<div className="introduction">
					<span className="title">{props.subject}</span>
					<span>{moment(props.showTime).format("MM/DD/YYYY")}</span>
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
