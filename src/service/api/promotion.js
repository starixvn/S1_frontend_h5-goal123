import { promotionRequest } from "./base";

export const api_promotion_GetCanJoinPromotionList = langId =>
	promotionRequest.post(`/GetCanJoinPromotionList/${langId}`);
