import { createContext } from "react";

export const defNavPanel = {
	login: "login",
	join: "join",
	subMenu: "subMenu"
};

export const i18nContext = createContext({});
export const navContext = createContext({});
export const popBoxContext = createContext({});
export const themeContext = createContext({});
export const userInfoContext = createContext({ isLogin: false });
export const walletInfoContext = createContext({});
export const bankSlipPopBoxContext = createContext({});
export const msgCountContext = createContext({});
