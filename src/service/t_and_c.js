import config from "../config";

export default langId => {
	return {
		terms: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/TermsConditions.html`,
		rule: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/RulesandRegulations.html`,
		OurPolicies: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/ResposibleGaming.html`,
		PrivacyPolicy: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/PrivacyPolicy.html`,
		CookiePolicy: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/CookiePolicy.html`,
		RuleRegulations: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/RulesandRegulations.html`,
		AccountTerms: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/AccountTerms.html`,
		FAQ: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/FAQ.html`,
		AboutUs: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/AboutUs.html`,
		Terms: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/Terms.html`,
		ContactUs: `${config.t_and_cURL}/SiteSkin/${config.siteName}/Static/${langId}/ContactUs.html`
	};
};
