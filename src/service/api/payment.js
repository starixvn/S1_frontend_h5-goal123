import { paymentRequest } from "./base";

export const api_GetBankInfoSysList = () =>
	paymentRequest.post("/GetBankInfoSysList");

export const api_GetDepositInfoHistory = ({ StartDate, EndDate, PageNumber }) =>
	paymentRequest.post("/GetDepositInfoHistory", {
		StartDate,
		EndDate,
		PageNumber
	});

export const api_GetOnlinePaymentList = () =>
	paymentRequest.post("/GetOnlinePaymentList");

export const api_GetOnlineBankInfoSysList = ({ payId }) =>
	paymentRequest.post("/GetOnlineBankInfoSysList", { payId });

export const api_GetOnlineBankInfo = ({ payId, sysId }) =>
	paymentRequest.post("/GetOnlineBankInfo", { payId, sysId });

export const api_GetWithdrawalInfoHistory = ({
	StartDate,
	EndDate,
	PageNumber
}) =>
	paymentRequest.post("/GetWithdrawalInfoHistory", {
		StartDate,
		EndDate,
		PageNumber
	});

export const api_GetStatement = ({ StartDate, EndDate, PageNumber }) =>
	paymentRequest.post("/GetStatement", {
		StartDate,
		EndDate,
		PageNumber
	});

export const api_GetBankInfoOffList = () =>
	paymentRequest.post("/GetBankInfoOffList");

export const api_GetMobilePayGroupList = () =>
	paymentRequest.post("/GetMobilePayGroupList");

export const api_DepositReqWireTransfer = ({ amount, sysId }) =>
	paymentRequest.post("/DepositReqWireTransfer", { amount, sysId });

export const api_GetDepositInfoRecent = () =>
	paymentRequest.post("/GetDepositInfoRecent");

export const api_SetDepositCancel = TransId =>
	paymentRequest.post("/SetDepositCancel", { TransId: TransId });

export const api_UploadReceipt = formData =>
	paymentRequest.post("/UploadReceipt", formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

export const api_SetDepositReceipt = (TransId, DepositTime, RefNo) =>
	paymentRequest.post("/SetDepositReceipt", {
		TransId: TransId,
		DepositTime: DepositTime,
		RefNo: RefNo
	});

export const api_GetMobilePayInfoList = GroupId =>
	paymentRequest.post("/GetMobilePayInfoList", {
		GroupId: GroupId
	});

export const api_WithdrawalReq = (AccountNo, amount, sysId) =>
	paymentRequest.post("/WithdrawalReq", {
		AccountNo,
		amount,
		sysId
	});

export const api_GetWithdrawalInfoRecent = () =>
	paymentRequest.post("/GetWithdrawalInfoRecent");

export const api_SetWithdrawalCancel = TransId =>
	paymentRequest.post("/SetWithdrawalCancel", { TransId });

export const api_KycCheck = () => paymentRequest.post("/KycCheck");
