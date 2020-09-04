import React, { useEffect, useState, useContext } from "react";
import Swiper from "react-id-swiper";
import config from "../../config";
import { api_GetBanner } from "../../service/api/site";
import {
	userInfoContext,
	navContext,
	defNavPanel
} from "../../components/common/context";
import { GET_ENTER_PAGE } from "../../service/enterPage";
import path from "../../path";

export const ClickLink = (
	tpId,
	gameId,
	lang,
	href,
	isOuterLink,
	urlWithLang,
	isLogin,
	setNav
) => {
	if (href === "Casino/Lobby") {
		window.location.href = `/${path.casino.root}${tpId ? `/${tpId}` : ""}`;
	} else if (tpId === null) {
		if (href === "Promotion/Index") {
			window.location.href = `/${path.promotion.root}`;
		} else if (href === "Home/Register") {
		} else {
			window.open(
				isOuterLink
					? href
					: `${config.t_and_cURL}${
							urlWithLang ? `/${lang}` : ""
					  }/${href}`,
				"_blank"
			);
		}
	} else {
		GET_ENTER_PAGE({
			langId: lang,
			tpId,
			gameId,
			isLogin: isLogin === true,
			loginCallback: () => {
				setNav(defNavPanel.login);
			}
		});
	}
};

const Panel = ({ ImgFolder, filterHideInHome = false }) => {
	const [banner, setBanner] = useState([]);
	const { userInfo } = useContext(userInfoContext);
	const { setNav } = useContext(navContext);

	useEffect(() => {
		let mounted = true;
		api_GetBanner(ImgFolder, "", userInfo.langId, filterHideInHome).then(
			res => {
				if (res.data.errorCode === 0 && mounted) {
					setBanner(res.data.data);
				}
			}
		);

		return () => (mounted = false);
	}, [userInfo, ImgFolder, filterHideInHome]);

	let rows = banner?.map((b, b_idx) => {
		let _imgFolder = b.imgFolder ?? ImgFolder;
		let lang =
			b.fromDB || b.lang?.includes(userInfo.langId)
				? userInfo.langId
				: "en";
		let actionLinkByLang = b.fromDB
			? null
			: b.actionLinkByLang?.find(a => a.lang === userInfo.langId);
		let actionLink = actionLinkByLang
			? actionLinkByLang.link
			: b.actionLink;
		let imgSRC = b.fromDB
			? b.imgURL
			: `${config.imgUrl}/CMS/${config.siteName}/${_imgFolder}/${lang}/${b.img}`;

		return (
			<button
				onClick={ClickLink.bind(
					this,
					b.tpId,
					b.gameId,
					lang,
					actionLink,
					b.outerLink === true,
					b.urlWithLang,
					userInfo.isLogin,
					setNav
				)}
				key={`${lang}-${b.img}-${b_idx}`}>
				<img src={imgSRC} className="banner" alt={b.img ?? ""} />
			</button>
		);
	});

	return <Autoplay Rows={rows} />;
};

const Autoplay = props => {
	const params = {
		spaceBetween: 30,
		centeredSlides: true,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true
		},
		rebuildOnUpdate: true
	};

	return <Swiper {...params}>{props.Rows}</Swiper>;
};

export default Panel;
