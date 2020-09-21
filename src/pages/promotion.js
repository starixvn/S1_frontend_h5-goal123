import React, { useEffect, useState, useContext } from "react";
import { userInfoContext, i18nContext } from "../components/common/context";
// import { api_GetBanner } from "../service/api/site";
import { api_promotion_GetPromotionListV2 } from "../service/api/promotion";
// import config, { siteInfo } from "../config";
import path from "../path";
import { Link } from "@reach/router";

const IndexPage = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const [promotion, setPromotion] = useState([]);

	useEffect(() => {
		let mounted = true;
		// api_GetBanner("Promotion", "", userInfo.langId).then(res => {
		// 	if (res.data.errorCode === 0 && mounted) {
		// 		setPromotion(
		// 			res.data.data.filter(b => {
		// 				return b.isBonus === true || b.fromDB === true;
		// 			})
		// 		);
		// 	}
		// });

		api_promotion_GetPromotionListV2({ langId: userInfo.langId }).then(
			res => {
				if (res.data.errorCode === 0 && mounted) {
					let result = res.data.data.sort((a, b) => {
						return a.periodFrom > b.periodFrom ? -1 : 1;
					});

					setPromotion(result);
				}
			}
		);

		return () => (mounted = false);
	}, [userInfo]);

	return promotion.map(p => {
		// let lang =
		// 	p.fromDB || p.lang.includes(userInfo.langId)
		// 		? userInfo.langId
		// 		: "en";
		// let actionLinkByLang = p.fromDB
		// 	? null
		// 	: p.actionLinkByLang?.find(a => a.lang === userInfo.langId);
		// let actionLink = actionLinkByLang
		// 	? actionLinkByLang.link
		// 	: p.actionLink;

		// let imgSRC = p.fromDB
		// 	? p.imgURL
		// 	: `${config.imgUrl}/CMS/${siteInfo().siteName}/Promotion/${lang}/${
		// 			p.img
		// 	  }`;

		let imgSRC = p.banner;

		return (
			<Link
				to={`/${path.promotionInfo.root}?BonusCode=${p.bonusCode}`}
				className="promodule"
				target="_blank"
				rel="noopener noreferrer"
				key={`promotion-${userInfo.langId}-${p.bonusCode}`}>
				<img src={imgSRC} alt={p.bonusCode ?? ""} />
				<div className="protitle"></div>
				<div className="text"></div>
				<div className="btn-group">
					<button className="orange">{i18n.lbl_Details}</button>
				</div>
			</Link>
		);
	});
};

export default IndexPage;
