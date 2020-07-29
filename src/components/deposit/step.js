import React from "react";

const totalStep = 3;
const Panel = ({ step, total = totalStep }) => {
	let processBar =
		step === 1 ? (
			<div></div>
		) : step === 2 ? (
			<div className="stepBar50"></div>
		) : (
			<div className="stepBar100"></div>
		);

	let rows = [];
	for (let s = 1; s <= total; s++) {
		rows.push(
			<div key={`step-${s}`} className="circle">
				<div>
					{s <= step ? (
						<div className="icon icon-checkmark"></div>
					) : (
						<div>{s}</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="step">
			<div className="stepLine">{processBar}</div>
			{rows}
		</div>
	);
};

export default Panel;
