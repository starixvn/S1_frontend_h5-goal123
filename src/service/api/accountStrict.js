import { accountStrictRequest } from "./base";

export const api_GetCustProfile = () =>
	accountStrictRequest.post("/GetCustProfile");

export const api_SetProfile = ({
	AccountName,
	Birth_d,
	Birth_m,
	Birth_y,
	CountryCode,
	AreaCode,
	PhoneNo,
	Email
}) =>
	accountStrictRequest.post("/SetProfile", {
		AccountName,
		Birth_d,
		Birth_m,
		Birth_y,
		CountryCode,
		AreaCode,
		PhoneNo,
		Email
	});

export const api_SetCustBankInfo = ({ AccountName, AccountNo, SysId }) =>
	accountStrictRequest.post("/SetCustBankInfo", {
		AccountName,
		AccountNo,
		SysId
	});

export const api_DelCustBankInfo = ({ AccountName, AccountNo, SysId }) =>
	accountStrictRequest.post("/DelCustBankInfo", {
		AccountName,
		AccountNo,
		SysId
	});

export const api_ResetPassword = ({ NewPassword }) =>
	accountStrictRequest.post("/ResetPassword", {
		NewPassword
	});

export const api_UploadCustPhotoId = formData =>
	accountStrictRequest.post("/UploadCustPhotoId", formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

export const api_SendVerifySMS = () =>
	accountStrictRequest.post("/SendVerifySMS");

export const api_VerifyPhone = ({ request_id, code }) =>
	accountStrictRequest.post("/VerifyPhone", {
		request_id,
		code
	});
