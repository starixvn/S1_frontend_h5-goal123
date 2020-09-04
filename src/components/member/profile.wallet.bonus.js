import React from "react";
import { number_format } from "../common/common";

export default ({
	i18n,
	currencyId,
	promoCategoryId,
	bonus,
	turnover,
	rollover
}) => {
	let percentage =
		turnover > rollover ? 100 : ((turnover / rollover) * 100).toFixed(2);
	return (
		<div className="progressBarModule">
			<div className="bounsName">
				{i18n[`lbl_PromoCategory_${promoCategoryId}`]}
			</div>
			<div>
				<span className="text-org">
					{i18n[`Currency_${currencyId}`]}{" "}
				</span>{" "}
				{number_format(bonus)}
			</div>
			<div className="progressBar">
				<div className="bar">
					<div
						className="progress"
						style={{ width: `${percentage}%` }}></div>
				</div>
				<div className="percentage">{percentage}%</div>
			</div>
		</div>
	);
};
