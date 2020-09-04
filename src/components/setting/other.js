import React, { useContext } from "react";
import { userInfoContext, i18nContext } from "../common/context";
import TandC from "../../service/t_and_c";
import { siteInfo } from "../../config";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	let _siteInfo = siteInfo();

	let socialMedia =
		_siteInfo.socialMedia &&
		Object.values(_siteInfo.socialMedia).map(v => {
			return (
				<a
					key={`other-socialMedia-${v.displayKey}`}
					href={v.link}
					target="_blank"
					className={`icon icon-${v.icon}`}>
					{i18n[v.displayKey]}
				</a>
			);
		});

	return (
		<div className="webmap">
			<div>
				<span>{i18n.lbl_OurPolicies}</span>
				<a href={TandC(userInfo.langId).OurPolicies} target="_blank">
					{i18n.lbl_ResposibleGaming}
				</a>
				<a href={TandC(userInfo.langId).terms} target="_blank">
					{i18n.lbl_TermsConditions}
				</a>
				<a href={TandC(userInfo.langId).PrivacyPolicy} target="_blank">
					{i18n.lbl_PrivacyPolicy}
				</a>
				<a href={TandC(userInfo.langId).CookiePolicy} target="_blank">
					{i18n.lbl_CookiePolicy}
				</a>
			</div>
			<div>
				<span>{i18n.lbl_HelpSupport}</span>
				<a
					href={TandC(userInfo.langId).RuleRegulations}
					target="_blank">
					{i18n.lbl_RuleRegulations}
				</a>
				<a href={TandC(userInfo.langId).AccountTerms} target="_blank">
					{i18n.lbl_AccountTerms}
				</a>
				<a href={TandC(userInfo.langId).FAQ} target="_blank">
					{i18n.lbl_FAQ}
				</a>
			</div>
			<div>
				<span>{i18n.lbl_Title}</span>
				<a href={TandC(userInfo.langId).AboutUs} target="_blank">
					{i18n.lbl_AboutUs}
				</a>
				<a href={TandC(userInfo.langId).Terms} target="_blank">
					{i18n.lbl_Terms}
				</a>
				<a href={TandC(userInfo.langId).ContactUs} target="_blank">
					{i18n.lbl_ContactUs}
				</a>
			</div>
			{socialMedia && socialMedia.length > 0 ? (
				<div>
					<span>{i18n.lbl_SocialMedia}</span>
					{socialMedia}
				</div>
			) : null}
		</div>
	);
};
