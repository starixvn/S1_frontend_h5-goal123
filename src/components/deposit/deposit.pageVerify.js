import React, { useEffect } from "react";
import path from "../../path";

export default (
	userInfo,
	i18n,
	setPopBox,
	setRedirectPath,
	setPageVerify,
	propsFromParent
) => {
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (!propsFromParent) {
				if (
					userInfo.isLogin &&
					userInfo.currencyId &&
					(!userInfo.accountName || !userInfo.phoneNo)
				) {
					const ClosePopBox = () => {
						setPopBox({ isOpen: false });
						setRedirectPath(`/${path.member.root}`);
					};

					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.lbl_UpdatePersonalInfo,
						hasBtn: true,
						hideCloseBtn: true,
						btnBar: (
							<div className="btn-group">
								<button className="blue" onClick={ClosePopBox}>
									{i18n.lbl_UpdatePersonalDetail}
								</button>
							</div>
						)
					});
					if (mounted) {
						setPageVerify(false);
					}
				} else {
					if (mounted) {
						setPageVerify(true);
					}
				}
			}
		}

		return () => {
			mounted = false;
		};
	}, [
		userInfo.accountName,
		userInfo.birth_d,
		userInfo.phoneNo,
		userInfo.currencyId,
		userInfo.isLogin,
		i18n,
		setPopBox,
		setPageVerify,
		setRedirectPath,
		propsFromParent
	]);
};
