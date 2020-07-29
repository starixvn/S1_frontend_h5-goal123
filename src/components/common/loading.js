import React, { useContext } from "react";
import { i18nContext } from "../common/context";
import Logo from "../../styles/img/logo.png";

export default () => {
	const { i18n } = useContext(i18nContext);

	return (
		<div id="Loading" className="open">
			<div className="container">
				<div>
					<div>
						<img src={Logo} />
					</div>
					<div>
						<img src={Logo} />
					</div>
					<div>
						<img src={Logo} />
					</div>
					<div>
						<img src={Logo} />
					</div>
				</div>
				<div className="text">{i18n.lbl_Loading}...</div>
			</div>
		</div>
	);
};
