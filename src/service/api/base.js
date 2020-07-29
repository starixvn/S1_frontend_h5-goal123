import axios from "axios";
import config from "../../config";

const rootURL = config.apiURL;

export const loginRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/Site`
});

export const siteRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/Site`
});

export const accountStrictRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/AccountStrict`
});

export const accountRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/Account`
});

export const messageRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/Message`
});

export const entPageRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/entPage`
});

export const paymentRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/Payment`
});

export const tpRequest = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/api/Tp`
});
