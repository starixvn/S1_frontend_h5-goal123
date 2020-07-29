import React, { useState, useContext, useEffect } from "react";
import {
	i18nContext,
	navContext,
	defNavPanel,
	userInfoContext
} from "../common/context";
import gameList from "../../datas/gameList";
import { GET_ENTER_PAGE } from "../../service/enterPage";
import { Redirect } from "@reach/router";

const SubGameList = () => {
	const { i18n } = useContext(i18nContext);
	const [category, setCategory] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const { nav, setNav } = useContext(navContext);
	const [redirect, setRedirect] = useState({
		redirect: false,
		path: ""
	});

	useEffect(() => {
		let mounted = true;
		if (nav !== null && mounted) {
			setRedirect({
				redirect: false,
				path: ""
			});
		}
		return () => (mounted = false);
	}, [nav]);

	const clickGame = ({ tpId, gameId, path }) => {
		if (path) {
			setNav(null);
			setRedirect({
				redirect: true,
				path: path
			});
		} else {
			GET_ENTER_PAGE({
				langId: userInfo.langId,
				tpId,
				gameId,
				isLogin: userInfo.isLogin === true,
				loginCallback: () => {
					setNav(defNavPanel.login);
				}
			});
		}
	};

	const selectCategory = _category => {
		if (category === _category) {
			setCategory(null);
		} else {
			setCategory(_category);
		}
	};

	let arr = gameList.map(item => {
		let _open = category === item.category;
		return (
			<ItemList
				key={`subGameList-${item.category}`}
				onClick={
					!item._blank
						? selectCategory.bind(null, item.category)
						: clickGame.bind(this, { ...item })
				}
				isOpen={`${_open ? " open" : ""}`}
				category={item.category}
				items={item.items}
				translation={i18n[item.translation]}
				itemOpen={`${_open && !item._blank ? " open" : ""}`}
				clickGame={clickGame}
				i18n={i18n}
			/>
		);
	});

	return redirect.redirect ? (
		<Redirect to={redirect.path} noThrow />
	) : (
		<div className="subGameList">{arr}</div>
	);
};

const ItemList = props => {
	let itemArr = props.items?.map(item => {
		return (
			<Item
				itemOpen={props.itemOpen}
				colName={item.icon}
				key={`subGameItem-tpId: ${item.tpId}-gameId: ${item.gameId}`}
				clickGame={props.clickGame.bind(this, { ...item })}
				translation={item.translation}
				i18n={props.i18n}
			/>
		);
	});

	return (
		<>
			<button
				className={`icon icon-${props.category}${props.isOpen}`}
				onClick={props.onClick}>
				<span>{props.translation}</span>
			</button>
			<div className={props.itemOpen}>{itemArr}</div>
		</>
	);
};

const Item = props => {
	return (
		<a
			className={`icon icon-${props.colName}${props.itemOpen}`}
			onClick={props.clickGame}>
			{props.i18n[props.translation]}
		</a>
	);
};

export default SubGameList;
