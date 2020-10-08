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
				if (mounted) {
					setPageVerify(true);
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
