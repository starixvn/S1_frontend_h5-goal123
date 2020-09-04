import React, { useEffect, useContext, useState } from "react";
import Dropdown from "../common/dropdown";
import { i18nContext, userInfoContext } from "../common/context";
import { api_promotion_GetCanJoinPromotionList } from "../../service/api/promotion";
import config from "../../config";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const [selPromoIdx, setSelPromoIdx] = useState(null);
	const [promoList, setPromoList] = useState(null);

	useEffect(() => {
		let mounted = true;
		if (userInfo.isLogin === true) {
			api_promotion_GetCanJoinPromotionList(userInfo.langId).then(res => {
				if (mounted) {
					if (res.data.errorCode === 0) {
						setPromoList(() => {
							return res.data.data?.map(p => {
								let detailInfo = JSON.parse(p.details)?.[
									userInfo.langId
								];
								return {
									displayText: detailInfo.title,
									id: p.bonusCode,
									bonusCode: p.bonusCode
								};
							});
						});
					}
				}
			});
		}

		return () => (mounted = false);
	}, [userInfo.isLogin, userInfo.langId]);

	const OnSelect = idx => {
		if (selPromoIdx !== idx) {
			setSelPromoIdx(idx);
		}
	};

	return promoList === null ? (
		<></>
	) : (
		<>
			<div className="inputBox">
				<Dropdown
					mainKey="localBank-promoList"
					i18n={i18n}
					options={promoList}
					selectedIdx={selPromoIdx}
					onSelectItem={OnSelect}
					placeholder={"Please select a promotion"}
				/>
				{selPromoIdx === null ? null : (
					<div className="tip">
						<a
							href={`${config.apiURL}/Promotion/Bonus?BonusCode=${promoList[selPromoIdx].bonusCode}`}
							target="_blank"
							rel="noopener noreferrer">
							More Info
						</a>
					</div>
				)}
			</div>
			{selPromoIdx === null ? null : (
				<div className="text-white-border-org">
					<span>Your bonus will transfer to </span>
					<span>{i18n.lbl_Wallet_Saba}</span>
				</div>
			)}
		</>
	);
};
