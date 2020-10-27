import React, { useEffect, useState, useContext, useRef } from "react";
import {
	userInfoContext,
	i18nContext,
	popBoxContext
} from "../components/common/context";
import { api_promotion_GetPromotionListV2 } from "../service/api/promotion";
import path from "../path";
import { Link } from "@reach/router";
import PromotionNavBar from "../components/promotion/promotion.nav";
import {
	isExpiry,
	displayExpiryTime,
	isClaimed,
	isNew
} from "../components/promotion/promotion.common";
import { number_format, isConvert } from "../components/common/common";
import JoinBtn from "../components/promotion/promotion.joinBtn";
import {
	defPromotionType,
	defFilterType
} from "../components/promotion/promotion.def";

const IndexPage = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [promotion, setPromotion] = useState([]);
	const [initPromoList, setInitPromoList] = useState(null);
	const [filter, setFilter] = useState(defFilterType.all);
	const [currentPage, setCurrentPage] = useState("processing");
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetPromotionList();
	}, [userInfo]);

	const GetPromotionList = () => {
		api_promotion_GetPromotionListV2({ langId: userInfo.langId }).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let result = res.data.data.sort((a, b) => {
							return a.periodFrom > b.periodFrom ? -1 : 1;
						});

						setInitPromoList(result);
						setPromotionDatas(result, filter);
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
	};

	const setPromotionDatas = (promoList, filterType) => {
		let afterFilterList = [];

		if (filterType === defFilterType.all) {
			afterFilterList = promoList.filter(
				p => !isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else if (filterType === defFilterType.expiry) {
			afterFilterList = promoList.filter(p =>
				isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else if (filterType === defFilterType.firstDeposit) {
			afterFilterList = promoList.filter(
				p =>
					(p.promotionType === filterType ||
						p.promotionType === defPromotionType.walletBonus) &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else {
			afterFilterList = promoList.filter(
				p =>
					p.promotionType === filterType &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		}

		setPromotion(afterFilterList);
	};

	const selectPromoType = type => {
		if (initPromoList) {
			setPromotionDatas(initPromoList, type);
		}
		setFilter(type);
	};

	const switchCurrentPage = page => {
		let type =
			page === "expired" ? defFilterType.expiry : defFilterType.all;

		setPromotionDatas(initPromoList, type);
		setFilter(type);
		setCurrentPage(page);
	};

	const arr = promotion.map(p => {
		let imgSRC = p.banner;
		let _isClaimed = isClaimed(p);
		let _isNew = _isClaimed ? false : isNew(p);

		return (
			<div
				className={`promodule${_isClaimed ? " open" : ""}${
					currentPage === "expired" ? " Expired" : ""
				}`}
				target="_blank"
				rel="noopener noreferrer"
				key={`promotion-${userInfo.langId}-${p.bonusCode}`}>
				{_isClaimed ? (
					<div className="claimed"></div>
				) : _isNew ? (
					<div className="new active"></div>
				) : (
					<></>
				)}
				<img src={imgSRC} alt={p.bonusCode ?? ""} />
				<div className="protitle">{p.title}</div>
				<div className="text">{p.description}</div>
				<div className="rollover">
					<div>
						{p.requiredAmount > 0 ? (
							<>
								<div className="icon icon-icon32px_money">
									{i18n.lbl_MinAmount}
								</div>
								<div>
									{number_format(
										p.requiredAmount,
										isConvert(userInfo.currencyId)
									)}
								</div>
							</>
						) : (
							<></>
						)}
						<div className="icon icon-icon32px_time">
							{i18n.lbl_RemainingTime}
						</div>
						<div>{displayExpiryTime({ ...p, i18n: i18n })}</div>
						<div className="icon icon-icon32px_">
							{i18n.lbl_RollOver}
						</div>
						<div>{p.rollOver ? p.rollOver : 1}X</div>
					</div>
				</div>
				<div className="btn-group">
					<Link
						to={`/${path.promotionInfo.root}?BonusCode=${p.bonusCode}`}
						className="orange">
						{i18n.lbl_Details}
					</Link>
					<JoinBtn
						userInfo={userInfo}
						i18n={i18n}
						p={p}
						currentPage={currentPage}
						GetPromotion={GetPromotionList}
						isList={true}
						setPopBox={setPopBox}
					/>
				</div>
			</div>
		);
	});

	return (
		<>
			<div className="tag">
				<a
					className={currentPage === "processing" ? "open" : ""}
					onClick={switchCurrentPage.bind(this, "processing")}>
					{i18n.lbl_Processing}
				</a>
				<a
					className={currentPage === "expired" ? "open" : ""}
					onClick={switchCurrentPage.bind(this, "expired")}>
					{i18n.lbl_PromoCategory_5}
				</a>
			</div>

			<div className="inputBox filterBtn">
				{currentPage === "processing" ? (
					<PromotionNavBar
						i18n={i18n}
						selected={filter}
						selectPromoType={selectPromoType}
					/>
				) : (
					<></>
				)}
			</div>

			{promotion.length > 0 ? (
				<>{arr}</>
			) : (
				<div className="not-found">{i18n.msg_NoData}</div>
			)}
		</>
	);
};

export default IndexPage;
