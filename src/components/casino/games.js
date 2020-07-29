import React, { useContext } from "react";
import config from "../../config";
import { userInfoContext } from "../common/context";
import Loading from "../common/loading";

const Games = props => {
	const { userInfo } = useContext(userInfoContext);

	if (props.Games === null) {
		return <Loading />;
	} else {
		let games = [];
		props.Games.forEach(g => {
			let t = props.TpList[g.tpId];
			let _isFavorite = props.Favorite.includes(`${t.value}_${g.gameId}`);
			games.push(
				<div
					className="info"
					key={`casino-game-${t.value}-${g.gameId}`}>
					<img
						onClick={props.SelectGame.bind(this, t.value, g)}
						src={`${config.imgUrl}/common/images/Casino/${t.name}/${
							g.imgName[userInfo.langId] ?? g.imgName.en
						}`}
						alt={g.name[userInfo.langId] ?? g.name.en}
					/>
					<span>{t.name}</span>
					<span
						onClick={props.SetFavorite.bind(
							this,
							t.value,
							g.gameId
						)}
						className={`icon icon-star-${
							_isFavorite ? "full" : "empty"
						}`}></span>
				</div>
			);
		});

		return games.length === 0 ? (
			<div className="not-found">{props.i18n["msg_NoData"]}</div>
		) : (
			<div className="slotList" id="scrollId">
				{games}
			</div>
		);
	}
};

export default Games;
