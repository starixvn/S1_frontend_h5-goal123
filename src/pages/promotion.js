import React, { useEffect, useState, useContext } from "react";
import { userInfoContext, i18nContext } from "../components/common/context";
import { api_GetBanner } from "../service/api/site";
import config, { siteInfo } from "../config";

const IndexPage = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const [promotion, setPromotion] = useState([]);

	useEffect(() => {
		let mounted = true;
		api_GetBanner("Promotion", "", userInfo.langId).then(res => {
			if (res.data.errorCode === 0 && mounted) {
				setPromotion(
					res.data.data.filter(b => {
						return b.isBonus === true || b.fromDB === true;
					})
				);
			}
		});

		return () => (mounted = false);
	}, [userInfo]);

	return promotion.map(p => {
		let lang =
			p.fromDB || p.lang.includes(userInfo.langId)
				? userInfo.langId
				: "en";
		let actionLinkByLang = p.fromDB
			? null
			: p.actionLinkByLang?.find(a => a.lang === userInfo.langId);
		let actionLink = actionLinkByLang
			? actionLinkByLang.link
			: p.actionLink;

		let href = `${config.t_and_cURL}${
			p.urlWithLang || p.fromDB ? `/${lang}` : ""
		}/${actionLink}`;

		let imgSRC = p.fromDB
			? p.imgURL
			: `${config.imgUrl}/CMS/${siteInfo().siteName}/Promotion/${lang}/${
					p.img
			  }`;

		return (
			<a
				href={href}
				className="promodule"
				target="_blank"
				rel="noopener noreferrer"
				key={`promotion-${userInfo.langId}-${p.img}`}>
				<img src={imgSRC} alt={p.imgName ?? ""} />
				<div className="protitle">{p.title?.[lang]}</div>
				<div className="text"></div>
				<div className="btn-group">
					<button className="orange">{i18n.lbl_Details}</button>
				</div>
			</a>
		);
	});
};

export default IndexPage;
