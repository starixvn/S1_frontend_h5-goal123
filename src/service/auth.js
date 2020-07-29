import { api_UserLogin, api_UserLogout } from "../service/api/account";
import { api_GetCustProfile } from "../service/api/accountStrict";
import { api_CheckSignIn } from "../service/api/site";

export const IS_LOGGED_IN = async () => {
	return await api_CheckSignIn().then(res => res.data.errorCode === 0);
};

const isBrowser = typeof window !== `undefined`;

export const LOGIN = async ({ userName, password }, CallbackLogin) => {
	if (!isBrowser) return false;

	await api_UserLogin({
		UserName: userName,
		Userpwd: password,
		isPersistent: true
	}).then(
		res => {
			if (res.data.errorCode === 0) {
				let userlangId = res.data.message.replace("/", "");

				api_GetCustProfile().then(res_custInfo => {
					let _loginUser = {
						userName: userName,
						langId: userlangId,
						isLogin: true
					};

					if (res_custInfo.data.errorCode === 0) {
						let data = res_custInfo.data.data;
						_loginUser = {
							..._loginUser,
							...data
						};
					}

					CallbackLogin(res.data.errorCode, "", true, _loginUser);
				});
			} else {
				CallbackLogin(res.data.errorCode, res.data.message, false, {});
			}
		},
		err => {
			CallbackLogin(999, "", false, {});
		}
	);

	return false;
};

export const LOGOUT = callback => {
	if (!isBrowser) return;
	api_UserLogout().then(
		res => {
			if (res.data.errorCode === 0) {
				callback();
			}
		},
		err => {
			if (err.response.status === 401) {
				callback();
			}
		}
	);
};
