import React from "react";
import { getUrlParameter } from "../common/common";
import path from "../../path";

export const redirectToPrev = (i18n, setPopBox, closePopbox) => {
	let _prevPage = getUrlParameter("prevPage");
	if (_prevPage === path.withdrawal.root) {
		setPopBox({
			isOpen: true,
			title: i18n.msg_Updatesuccessful,
			content: i18n.lbl_GoWithdrawalPage,
			hasBtn: true,
			btnBar: (
				<div className="btn-group">
					<button className="blue" onClick={closePopbox}>
						{i18n["lbl_Cancel"]}
					</button>
					<button
						className="orange"
						onClick={closePopbox.bind(null, {
							_redirectPath: `/${path.withdrawal.root}`
						})}>
						{i18n["lbl_Confirm"]}
					</button>
				</div>
			)
		});
	} else if (_prevPage === path.promotionInfo.root) {
		setPopBox({
			isOpen: true,
			title: i18n.msg_Updatesuccessful,
			content: i18n.lbl_GoPromotionPage,
			hasBtn: true,
			btnBar: (
				<div className="btn-group">
					<button className="blue" onClick={closePopbox}>
						{i18n["lbl_Cancel"]}
					</button>
					<button
						className="orange"
						onClick={closePopbox.bind(null, {
							_redirectPath: `/${
								path.promotionInfo.root
							}?BonusCode=${getUrlParameter("BonusCode")}`
						})}>
						{i18n["lbl_Confirm"]}
					</button>
				</div>
			)
		});
	} else {
		setPopBox({
			isOpen: true,
			title: i18n.msg_Updatesuccessful,
			content: i18n.msg_GoToDepositPage,
			hasBtn: true,
			btnBar: (
				<div className="btn-group">
					<button className="blue" onClick={closePopbox}>
						{i18n["lbl_Cancel"]}
					</button>
					<button
						className="orange"
						onClick={closePopbox.bind(null, {
							_redirectPath: `/${path.deposit.root}`
						})}>
						{i18n["lbl_Confirm"]}
					</button>
				</div>
			)
		});
	}
};
