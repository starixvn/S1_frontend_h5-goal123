import React, { useContext } from "react";
import { i18nContext } from "../common/context";
import LoadingLogo from "../../styles/img/logo.png";

export default () => {
	const { i18n } = useContext(i18nContext);

	return <Loading loadingDisplayText={i18n.lbl_Loading} />;
};

const Loading = ({ loadingDisplayText }) => {
	return (
		<div id="Loading" className="open">
			<div className="container">
				<div>
					<div>
						<img src={LoadingLogo} alt="Goal123" />
					</div>
					<div>
						<img src={LoadingLogo} alt="Goal123" />
					</div>
					<div>
						<img src={LoadingLogo} alt="Goal123" />
					</div>
					<div>
						<img src={LoadingLogo} alt="Goal123" />
					</div>
				</div>
				<div className="text">{loadingDisplayText}...</div>
			</div>
		</div>
	);
};
