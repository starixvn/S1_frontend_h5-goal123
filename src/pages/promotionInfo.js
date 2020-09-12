import React, { useContext, useEffect, useState, useRef } from "react";
import {
	userInfoContext,
	popBoxContext,
	i18nContext
} from "../components/common/context";
import { getUrlParameter } from "../components/common/common";
import { api_promotion_GetPromotionDetail } from "../service/api/promotion";
import moment from "moment";
import { defPopBoxType } from "../components/common/popbox";

const promoStatus = {
	running: 1,
	Canceled: 2,
	Expiry: 3,
	TransferOut: 5
};

export default () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [promotionInfo, setPromotionInfo] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			let _bonusCode = getUrlParameter("bonusCode");

			api_promotion_GetPromotionDetail({
				langId: userInfo.langId,
				BonusCode: _bonusCode
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setPromotionInfo(res.data.data);
						} else {
							alert(res.data.message);
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(i18n.msg_ApiServerError);
					}
				}
			);
		}
	}, [userInfo.isLogin, userInfo.langId, i18n.msg_ApiServerError]);

	if (promotionInfo === null) return null;

	let expiryTime = moment.duration(
		moment
			.unix(
				promotionInfo.isJoin &&
					promotionInfo.status === promoStatus.running &&
					promotionInfo.custExpiryTime
					? promotionInfo.custExpiryTime
					: promotionInfo.periodTo
			)
			.diff(new Date())
	);

	let displayExpiryTime =
		expiryTime.days() +
		" " +
		i18n.lbl_Days +
		" " +
		expiryTime.hours() +
		" " +
		i18n.lbl_Hours;

	return (
		<div className="promodule">
			<img src={promotionInfo.banner} alt={promotionInfo.title} />

			<div className="protitle">{promotionInfo.title}</div>
			<div className="text">{promotionInfo.description}</div>
			<div className="info">
				<ul>
					<li>
						<span className="title">{i18n.lbl_RollOver}</span>
						<span>{promotionInfo.rollOver}x</span>
					</li>
					<li>
						<span className="title">{i18n.lbl_RemainingTime}</span>
						<span>{displayExpiryTime}</span>
					</li>
				</ul>
			</div>
			<div className="protitle">Significant Conditions</div>
			<div className="text">
				<ol>
					<li>
						This promotion applies only to Malaysian Ringgit account
						players;
					</li>
					<li>
						This promotion starts at until{" "}
						<span id="ExpiryTime">July 31 ,2020 23:59</span>{" "}
						(“Promotion Period”).
					</li>
					<li>
						To qualify, the player must have made their First
						Deposit and have not made any withdrawal requests
						before.
					</li>
					<li>
						A Bonus of up to Malaysian Ringgit 388 based on the
						First Deposit amount will be credited to qualified
						players within 48 hours;
					</li>
					<li>
						The Bonus and Qualifying Deposit amount used are subject
						to a 18 times rollover requirement within 30 days on any
						Nova88 products, except Casino, Live Casino,Virtual
						Games, Poker, Fishing Games, Chess Games and Cash Out.
					</li>
				</ol>
			</div>
			<div className="protitle">
				FULL PROMOTION SPECIFIC TERMS AND CONDITIONS
			</div>
			<div
				className="text"
				dangerouslySetInnerHTML={{
					__html: `<pre>${promotionInfo.details}</pre>`
				}}></div>
		</div>
	);
};
