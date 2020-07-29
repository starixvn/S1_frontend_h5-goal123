import React, { useContext, useEffect, useState } from "react";
import { Redirect, Link, useMatch } from "@reach/router";
import { i18nContext, userInfoContext } from "./context";

const IndexPage = ({ defTabs, children, beforeLogin }) => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	const [redirectPath, setRedirectPath] = useState(null);

	const CheckMatch = path => {
		return useMatch(path) !== null;
	};

	useEffect(() => {
		let mounted = true;
		if (mounted && redirectPath !== null) {
			setRedirectPath(null);
		}

		return () => {
			mounted = false;
		};
	}, [redirectPath, setRedirectPath]);

	useEffect(() => {
		let mounted = true;
		if (mounted && userInfo.isLogin === false && !beforeLogin) {
			setRedirectPath("/");
		}

		return () => {
			mounted = false;
		};
	}, [userInfo.isLogin, setRedirectPath, beforeLogin]);

	if (redirectPath !== null) {
		return <Redirect to="/" noThrow />;
	} else {
		let items = Object.keys(defTabs).map(key => {
			let tabItem = defTabs[key];
			let match =
				CheckMatch(`${tabItem.to}/*`) &&
				(!tabItem.excludeMath ||
					!CheckMatch(`${tabItem.excludeMath}/*`));

			return (
				<Link
					to={tabItem.to}
					key={`tab-btn-${key}`}
					className={match ? "open" : ""}>
					{i18n[tabItem.displayKey]}
				</Link>
			);
		});

		return (
			<>
				<div className="tag">{items}</div>
				{children}
			</>
		);
	}
};

export default IndexPage;
