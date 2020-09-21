import { promotionRequest } from "./base";

export const api_promotion_GetCanJoinPromotionList = langId =>
	promotionRequest.post(`/GetCanJoinPromotionList/${langId}`);

export const api_promotion_GetPromotionDetail = ({ langId, BonusCode }) =>
	promotionRequest.post(`/GetPromotionDetail/${langId}`, {
		BonusCode
	});

export const api_promotion_SetClaimPromotion = ({ langId, BonusCode }) =>
	promotionRequest.post(`/SetClaimPromotion/${langId}`, {
		BonusCode
	});

export const api_promotion_GetPromotionListV2 = ({ langId }) =>
	promotionRequest.post(`/GetPromotionListV2/${langId}`);
