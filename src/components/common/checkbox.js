import React from "react";

const Checkbox = props => {
	return (
		<div className={props.className}>
			<input
				type="checkbox"
				id={props.id}
				checked={props.Checked}
				onChange={props.checkboxHandler}
			/>
			<label htmlFor={props.id}>
				<div></div>
			</label>
			{props.children}
		</div>
	);
};

export default Checkbox;
