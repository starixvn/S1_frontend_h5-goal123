import React from "react";
import PropTypes from "prop-types";

const Inputbox = props => {
	return (
		<div className="inputBox">
			<i className={`icon ${props.icon}`}></i>
			<input
				type={props.inputType ?? "text"}
				placeholder={props.placeholder}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				onChange={props.onChange}
				value={
					props.value === null || props.value === undefined
						? ""
						: props.value
				}
				max={props.max ? props.max : null}
			/>
			{props.Warning?.status ? (
				<div className="icon-module">
					<i className="icon icon-warning"></i>
				</div>
			) : null}
			{props.showTips ? (
				<div
					className={`${props.ClassName}${
						props.showTips ? " open" : ""
					}`}>
					{props.Tips}
				</div>
			) : props.Warning?.status ? (
				<div
					className={`${props.ClassName}${
						props.Warning.status ? " open" : ""
					}`}>
					{props.Warning.msg}
				</div>
			) : null}
		</div>
	);
};

Inputbox.propTypes = {
	icon: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object
	]),
	inputType: PropTypes.string,
	placeholder: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	Warning: PropTypes.object,
	showTips: PropTypes.bool
};

export default Inputbox;
