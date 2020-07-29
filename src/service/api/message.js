import { messageRequest } from "./base";

export const api_GetAnnouncement = langId =>
	messageRequest.post(`/GetAnnouncement/${langId}`);
