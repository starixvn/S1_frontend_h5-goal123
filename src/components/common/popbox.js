import React, { useContext } from "react";
import { popBoxContext, i18nContext } from "../common/context";
import TurnoverAccumulated from "./popbox.turnover";

export const defPopBoxType = {
	default: "default",
	TurnoverAccumulated: "TurnoverAccumulated"
};

const PopUp = () => {
	const { popBox, setPopBox } = useContext(popBoxContext);
	const { i18n } = useContext(i18nContext);

	const handlePopBox = () => {
		setPopBox(prevState => ({ ...prevState, isOpen: false }));
	};

	let content = null;
	switch (popBox.popBoxType) {
		case defPopBoxType.TurnoverAccumulated:
			content = <TurnoverAccumulated {...popBox} />;
			break;

		default:
			content = (
				<div className="popTxt">
					{popBox.content}
					{popBox.hasBtn === true ? popBox.btnBar : <></>}
				</div>
			);
			break;
	}

	return (
		<div id="popup" className={`${popBox.isOpen ? "show" : ""}`}>
			<div className="popTit">
				{popBox.hideCloseBtn === true ? null : (
					<div className={`close open`} onClick={handlePopBox}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				)}
				{popBox.title ?? i18n.lbl_ImportantNote}
			</div>
			{content}
		</div>
	);
};
export default PopUp;
