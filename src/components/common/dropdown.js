import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

export class DropdownBox extends Component {
	constructor(props) {
		super(props);
		document.addEventListener("mousedown", this.handleClickOutside);
		this.state = { isOpen: false };
		this.wrapper = createRef(null);
	}
	handleClickOutside = e => {
		if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
			this.setState({ isOpen: false });
		}
	};
	ClickDropdown = () => {
		this.setState({ isOpen: !this.state.isOpen });
		if (this.props.clickDropdown) {
			this.props.clickDropdown(this.props.colName);
		}
	};
	SelectItem = value => {
		this.setState({ isOpen: false });
		this.props.onSelectItem(value, this.props.colName);
	};

	render() {
		let arr = this.props.options.map((item, i) => {
			let displayText = item.displayText
				? item.displayText
				: this.props.i18n?.[item.displayKey];
			return (
				<Item
					key={`${this.props.mainKey}-${item.id}`}
					displayText={displayText}
					onClick={this.SelectItem.bind(null, i)}
				/>
			);
		});

		let selected = null;
		if (this.props.options[this.props.selectedIdx]) {
			let _s = this.props.options[this.props.selectedIdx];

			if (_s.displayText) {
				selected = _s.displayText;
			} else {
				selected = this.props.i18n[_s.displayKey];
			}
		} else {
			selected = this.props.placeholder;
		}

		return (
			<div
				ref={this.wrapper}
				className={`dropdown${this.state.isOpen ? " open" : ""}`}
				onClick={this.ClickDropdown}>
				<button className="btn">
					<span className="text">{selected}</span>
				</button>
				<div
					className={`dropdown-container${
						this.state.isOpen ? " open" : ""
					}`}>
					{arr}
				</div>
			</div>
		);
	}
}

const Item = props => {
	return (
		<div className="dropdown-item" onClick={props.onClick}>
			<span className="text">{props.displayText}</span>
		</div>
	);
};

DropdownBox.propTypes = {
	colName: PropTypes.string,
	onSelectItem: PropTypes.func,
	options: PropTypes.array,
	selectedIdx: PropTypes.number,
	mainKey: PropTypes.string
};

export default DropdownBox;
