import React, { useContext, useEffect, useState, useRef } from "react";
import {
	userInfoContext,
	popBoxContext,
	i18nContext
} from "../components/common/context";
import {
	getUrlParameter,
	number_format,
	isConvert
} from "../components/common/common";
import { api_promotion_GetPromotionDetail } from "../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../service/api/account";
import { Link } from "@reach/router";
import path from "../path";
import ReloadSpin from "../components/common/reloadSpin";
import {
	isExpiry,
	displayExpiryTime,
	isClaimed,
	isNew
} from "../components/promotion/promotion.common";
import JoinBtn from "../components/promotion/promotion.joinBtn";

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

	const GetPromotionDetail = (langId, _bonusCode) => {
		api_promotion_GetPromotionDetail({
			langId: langId,
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
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ApiServerError
					});
				}
			}
		);
	};

	const RefreshProcessBar = ({ bonusCode, tpId, categoryId }) => {
		api_account_GetCustSpecificBonus({
			BonusCode: bonusCode,
			TpId: tpId,
			PromoCategoryId: categoryId
		}).then(
			res => {
				if (
					isMountedRef.current &&
					res.data.errorCode === 0 &&
					res.data.data
				) {
					setPromotionInfo(prevS => ({
						...prevS,
						custRollOver: res.data.data.rollover,
						custTurnOver: res.data.data.turnover
					}));
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

	if (promotionInfo === null) return null;

	let _isClaimed = isClaimed(promotionInfo);
	let _isNew = _isClaimed ? false : isNew(promotionInfo);
	let _isExpiry = isExpiry({ ...promotionInfo, isLogin: userInfo.isLogin });

	return (
		<div
			className={`promodule${_isClaimed ? " open" : ""}${
				_isExpiry ? " Expired" : ""
			}`}>
			{_isClaimed ? (
				<div className="claimed"></div>
			) : _isNew ? (
				<div className="new active"></div>
			) : (
				<></>
			)}
			<img src={promotionInfo.banner} alt={promotionInfo.title} />
			<Link className="btn-cancel" to={`/${path.promotion.root}`}>
				{i18n.lbl_Back}
			</Link>

			<JoinBtn
				userInfo={userInfo}
				i18n={i18n}
				p={promotionInfo}
				GetPromotion={GetPromotionDetail}
				isList={false}
				setPopBox={setPopBox}
			/>

			<div className="protitle">{promotionInfo.title}</div>
			<div className="text">{promotionInfo.description}</div>

			{promotionInfo.canJoin &&
			!promotionInfo.isJoin &&
			(promotionInfo.promotionType === 1 ||
				promotionInfo.promotionType === 2) ? (
				<DepositForm
					i18n={i18n}
					depositId={promotionInfo.depositId}
					depositAmount={number_format(
						promotionInfo.depositAmount,
						isConvert(userInfo.currencyId)
					)}
					displayCurrency={i18n[`Currency_${userInfo.currencyId}`]}
				/>
			) : null}

			{promotionInfo.isJoin &&
			promotionInfo.promotionType !== 6 &&
			promotionInfo.promotionType !== 7 ? (
				<ProcessBar
					i18n={i18n}
					currencyId={userInfo.currencyId}
					{...promotionInfo}
					RefreshProcessBar={RefreshProcessBar.bind(
						this,
						promotionInfo
					)}
				/>
			) : null}

			<div className="info">
				<ul>
					{promotionInfo.requiredAmount > 0 ? (
						<li>
							<span className="title">{i18n.lbl_MinAmount}</span>
							<span>
								{number_format(
									promotionInfo.requiredAmount,
									isConvert(userInfo.currencyId)
								)}
							</span>
						</li>
					) : (
						<></>
					)}
					<li>
						<span className="title">{i18n.lbl_RollOver}</span>
						<span>{promotionInfo.rollOver}x</span>
					</li>
					<li>
						<span className="title">{i18n.lbl_RemainingTime}</span>
						<span>
							{displayExpiryTime({
								...promotionInfo,
								i18n: i18n
							})}
						</span>
					</li>
				</ul>
			</div>
			<div
				className="text"
				dangerouslySetInnerHTML={{
					__html: `<pre>${promotionInfo.details}</pre>`
				}}></div>
		</div>
	);
};

const ProcessBar = ({
	i18n,
	currencyId,
	custTurnOver,
	custRollOver,
	RefreshProcessBar
}) => {
	let percentage =
		custTurnOver > custRollOver
			? 100
			: ((custTurnOver / custRollOver) * 100).toFixed(2);
	return (
		<div className="progressBarModule">
			<div className="bounsName">{i18n.lbl_TurnoverAccumulated}</div>
			<div className="turnover">
				<span>
					{i18n[`Currency_${currencyId}`]}{" "}
					{number_format(custTurnOver, false)}
				</span>{" "}
				/ ({i18n.lbl_Req} {i18n[`Currency_${currencyId}`]}{" "}
				{number_format(custRollOver, false)})
				<ReloadSpin func={RefreshProcessBar} />
			</div>
			<div className="progressBar">
				<div className="bar">
					<div
						className="progress"
						style={{ width: `${percentage}%` }}></div>
				</div>
				<div className="percentage">{percentage}%</div>
			</div>
		</div>
	);
};

const DepositForm = ({ i18n, depositId, depositAmount, displayCurrency }) => {
	return (
		<div className="minAmount">
			<div>
				<div>{i18n.lbl_ID}</div>
				<div>{depositId}</div>
			</div>
			<div>
				<div>{i18n.lbl_DepositAmount}</div>
				<div>
					{displayCurrency} {depositAmount}
				</div>
			</div>
		</div>
	);
};
