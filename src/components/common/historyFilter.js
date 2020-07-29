import React, { useState, useContext } from "react";
import { i18nContext } from "../common/context";
import moment from "moment";
import Dropdown from "../common/dropdown.icon";
import Inputbox from "../common/inputbox";

const quickPickList = [
	{ displayKey: "lbl_Today" },
	{ displayKey: "lbl_YesterDay" },
	{ displayKey: "lbl_ThisWeek" },
	{ displayKey: "lbl_LastWeek" },
	{ displayKey: "lbl_ThisMonth" },
	{ displayKey: "lbl_LastMonth" }
];

const Panel = props => {
	const { i18n } = useContext(i18nContext);
	const [quickPickSelectedIdx, setquickPickSelectedIdx] = useState(0);

	const today = moment().format("YYYY-MM-DD");
	const [startDayState, setStartDayState] = useState(today);
	const [endDayState, setEndDatyState] = useState(today);

	let startDate = "";
	let endDate = "";

	const dropdownStateHandler = i => {
		setquickPickSelectedIdx(i);

		if (i === 0) {
			startDate = moment().format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");
		} else if (i === 1) {
			startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
			endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
		} else if (i === 2) {
			startDate = moment().startOf("week").format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");
		} else if (i === 3) {
			startDate = moment()
				.subtract(1, "weeks")
				.startOf("week")
				.format("YYYY-MM-DD");
			endDate = moment()
				.subtract(1, "weeks")
				.endOf("week")
				.format("YYYY-MM-DD");
		} else if (i === 4) {
			startDate = moment().startOf("month").format("YYYY-MM-DD");
			endDate = moment().format("YYYY-MM-DD");
		} else {
			startDate = moment()
				.subtract(1, "months")
				.startOf("month")
				.format("YYYY-MM-DD");
			endDate = moment()
				.subtract(1, "months")
				.endOf("month")
				.format("YYYY-MM-DD");
		}

		setStartDayState(startDate);
		setEndDatyState(endDate);
	};

	const EditField = (col, e) => {
		let val = e.target.value;
		col === "startDay" ? setStartDayState(val) : setEndDatyState(val);
	};

	return (
		<>
			<div className="inputBox">
				<Dropdown
					i18n={i18n}
					mainKey="deposit-history-quickPick"
					options={quickPickList}
					selectedIdx={quickPickSelectedIdx}
					icon="icon icon-calendar"
					onSelectItem={dropdownStateHandler}
				/>
			</div>

			<div className="inputBox parts">
				<Inputbox
					icon="icon-calendar"
					inputType="date"
					onChange={EditField.bind(null, "startDay")}
					value={startDayState}
					max={moment().format("YYYY-MM-DD")}
				/>

				<Inputbox
					icon="icon-calendar"
					inputType="date"
					onChange={EditField.bind(null, "endDay")}
					value={endDayState}
					max={moment().format("YYYY-MM-DD")}
				/>
			</div>

			<div className="btn-group">
				<button
					className="orange switch"
					onClick={props.submitHandler.bind(
						this,
						startDayState,
						endDayState,
						false
					)}>
					{i18n["lbl_Submit"]}
				</button>
			</div>
		</>
	);
};

export default Panel;
