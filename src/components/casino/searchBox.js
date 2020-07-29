import React, { useContext, useState, useEffect } from "react";
import { i18nContext } from "../common/context";
import GameTypes from "./defGameType";
import Dropdown from "../common/dropdown";

const SearchBox = props => {
	const { i18n } = useContext(i18nContext);
	const [openAdvance, setOpenAdvance] = useState(false);

	const gameTypeList = [
		{ id: null, displayText: i18n.lbl_All },
		...Object.keys(GameTypes).map(k => {
			return { id: k, displayText: i18n[GameTypes[k].displayKey] };
		})
	];

	const providerList = [
		{ id: null, displayText: i18n.lbl_All },
		...Object.keys(props.TpList)?.map(k => {
			let d = props.TpList[k];
			return {
				id: d.value,
				displayText: d.displayKey ? i18n[d.displayKey] : d.displayText
			};
		})
	];

	useEffect(() => {
		if (!props.provider?.init) {
			const defaultProviderIdx = providerList.findIndex(
				p => p.id === props.DefaultProvider
			);
			if (defaultProviderIdx !== -1) {
				props.EditSearchField("provider", {
					idx: defaultProviderIdx,
					value: providerList[defaultProviderIdx].id,
					init: true
				});
			}
		}
	}, [i18n, props, providerList]);

	const HandleOpenAdvance = () => {
		setOpenAdvance(prevState => !prevState);
	};

	const EditField = (column, e) => {
		props.EditSearchField(column, e.target.value);
	};

	const SelectProvider = idx => {
		props.EditSearchField("provider", {
			idx: idx,
			value: providerList[idx].id,
			init: true
		});
	};

	const SelectGameType = idx => {
		props.EditSearchField("gameType", {
			idx: idx,
			value: gameTypeList[idx].id
		});
	};

	return (
		<>
			<div className="inputBox">
				<i className="icon icon-search"></i>
				<input
					className="search"
					placeholder="Search"
					value={props.searchText}
					onChange={EditField.bind(this, "searchText")}
				/>
				<button
					className="icon icon-equalizer filter"
					onClick={HandleOpenAdvance}></button>
			</div>
			<div className={`filterSelect${openAdvance ? " open" : ""}`}>
				<div className="inputBox">
					<Dropdown
						i18n={i18n}
						mainKey="casino-gamePlatform"
						options={providerList}
						selectedIdx={props.provider?.idx}
						onSelectItem={SelectProvider}
						placeholder={"Game Platform"}
					/>
				</div>
				<div className="inputBox">
					<Dropdown
						i18n={i18n}
						mainKey="casino-gamePlatform"
						options={gameTypeList}
						selectedIdx={props.gameType?.idx}
						onSelectItem={SelectGameType}
						placeholder={"Game Type"}
					/>
				</div>
			</div>
		</>
	);
};

export default SearchBox;
