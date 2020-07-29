import React from "react";
import PropTypes from "prop-types";

const Inputbox = props => {
	return (
		<div className="inputBox">
			<i className={`icon ${props.icon}`}></i>
			<input
				type={props.inputType}
				placeholder={props.placeholder}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				onChange={props.onChange}
				value={props.value}
			/>
			<div className="icon-module">
				<i
					className={`icon ${
						!props.showPsw ? "icon-eye-blocked" : "icon-eye"
					}`}
					onClick={props.showPswHandler}></i>
				{props.Warning.status ? (
					<i className="icon icon-warning"></i>
				) : null}
			</div>
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
	value: PropTypes.string.isRequired,
	showPswHandler: PropTypes.func.isRequired,
	showPsw: PropTypes.bool.isRequired,
	inputType: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	Warning: PropTypes.object,
	showTips: PropTypes.bool
};

export default Inputbox;
