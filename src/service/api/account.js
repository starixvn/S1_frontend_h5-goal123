import { loginRequest } from "./base";
import { accountRequest } from "./base";

export const api_SetLanguage = lang =>
	accountRequest.post("/SetLanguage", { LangId: lang });

export const api_UserLogout = () => accountRequest.post("/SignOut");

export const api_UserLogin = data => loginRequest.post("/SignIn", data);

export const api_onlineCheck = () => accountRequest.post("/onlineCheck");

export const api_GetBalnace = () => accountRequest.post("/GetBalance");

export const api_GetCustBankInfo = () =>
	accountRequest.post("/GetCustBankInfo");

export const api_GetMsgList = ({ PageNumber }) =>
	accountRequest.post("/GetMsgList", { PageNumber });

export const api_GetMsgContent = MsgId =>
	accountRequest.post("/GetMsgContent", {
		MsgId: MsgId
	});

export const api_DelMsg = MsgIds =>
	accountRequest.post("/DelMsg", { MsgIds: MsgIds });

export const api_GetWalletInfo = () => accountRequest.post("/GetWalletInfo");

export const api_GetWithdrawalAvailableBalance = () =>
	accountRequest.post("/GetWithdrawalAvailableBalance");

export const api_SetFavoriteGame = (ProviderId, GameId, IsRemove) =>
	accountRequest.post(`/SetFavoriteGame`, { ProviderId, GameId, IsRemove });

export const api_GetFavoriteGame = () =>
	accountRequest.post("/GetFavoriteGame");

export const api_GetMsgCount = () => accountRequest.post("/GetMsgCount");

export const api_ChangePassword = ({ OldPassword, NewPassword }) =>
	accountRequest.post("/ChangePassword", { OldPassword, NewPassword });
