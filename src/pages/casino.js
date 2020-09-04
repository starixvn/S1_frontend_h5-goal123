import React, { useContext } from "react";
import Slider from "../components/casino/slider";
import defNav from "../components/casino/defNav";
import Nav from "../components/casino/nav";
import SearchBox from "../components/casino/searchBox";
import { api_GetGamelist } from "../service/api/site";
import Games from "../components/casino/games";
import {
	i18nContext,
	userInfoContext,
	navContext,
	defNavPanel
} from "../components/common/context";
import {
	api_SetFavoriteGame,
	api_GetFavoriteGame
} from "../service/api/account";
import { GET_CASINO_ENTER_PAGE } from "../service/enterPage";

const eachPageItem = 20;

class Panel extends React.Component {
	constructor(props) {
		super(props);
		this.trigger = false;
		this.state = {
			tpList: {},
			hasMore: true,
			totalCount: 0,
			displayedCount: 0,
			displayGames: null,
			selGameInfo: null,
			gameDatas: null,
			searchInfo: {
				searchText: "",
				provider: { idx: 0, value: null, init: false },
				gameType: { idx: 0, value: null }
			},
			favorite: [],
			selNav: Object.keys(defNav)?.[0]
		};
	}
	componentWillUnmount = () => {
		this.mounted = false;
		window.removeEventListener("mousewheel", this.ScrollBarListener);
		window.removeEventListener("touchmove", this.ScrollBarListener, {
			passive: false
		});
	};

	ScrollBarListener = () => {
		let window_height =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;

		let window_scrollTop =
			window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop;

		let body = document.body;
		let html = document.documentElement;

		let document_height =
			Math.max(
				body.scrollHeight,
				body.offsetHeight,
				html.clientHeight,
				html.scrollHeight,
				html.offsetHeight
			) * 0.8;

		if (
			!this.trigger &&
			window_height + window_scrollTop >= document_height
		) {
			this.trigger = true;
			this.SetMoreItems();
		}
	};

	componentDidMount() {
		this.mounted = true;

		window.addEventListener("mousewheel", this.ScrollBarListener, false);
		window.addEventListener("touchmove", this.ScrollBarListener, {
			passive: false
		});
		api_GetGamelist().then(res => {
			if (res.data.errorCode === 0) {
				let _tpList = {};
				let games = [];

				let hasPromo = false;
				let hasFeature = false;
				res.data.data.forEach(t => {
					_tpList[t.value] = { ...t };
					if (t.gameList.data) {
						t.gameList.data.forEach(g => {
							if (t.value === this.props.tpId) {
								hasPromo =
									hasPromo === false
										? g.promotion === 1
										: hasPromo;
								hasFeature =
									hasFeature === false
										? g.featured === true
										: hasFeature;
							}
							games.push({
								tpId: t.value,
								...g
							});
						});
					}
				});

				if (games.length) {
					for (let i = 0; i < games.length; i++) {
						let idx = Math.floor(Math.random() * games.length);
						let tempEle1 = games[i];
						let tempEle2 = games[idx];

						games[i] = tempEle2;
						games[idx] = tempEle1;
					}
				}

				if (this.mounted) {
					let nav = hasPromo
						? defNav.PROMO.key
						: hasFeature
						? defNav.FEATURED.key
						: defNav.ALLGAMES.key;
					this.setState(
						{
							tpList: _tpList,
							gameDatas: games,
							selNav: nav
						},
						() => {
							this.SetMoreItems();
						}
					);
				}
			}
		});

		if (this.props.userInfo.isLogin) {
			api_GetFavoriteGame().then(res => {
				if (res.data.errorCode === 0 && res.data.data) {
					let fav = res.data.data.map(f => {
						return `${f.providerId}_${f.gameId}`;
					});
					if (this.mounted) {
						this.setState({ favorite: fav });
					}
				}
			});
		}
	}

	SetFavorite = (tpId, gameId) => {
		let key = `${tpId}_${gameId}`;
		let isRemove = this.state.favorite?.includes(key);
		let newFav = isRemove
			? this.state.favorite?.filter(f => f !== key)
			: [...this.state.favorite, key];
		let displayGames = isRemove
			? this.state.displayGames.filter(
					g => !(g.tpId === tpId && g.gameId === gameId)
			  )
			: this.state.displayGames;
		if (this.mounted) {
			this.setState({ favorite: newFav, displayGames: displayGames });
		}
		if (this.props.userInfo.isLogin) {
			api_SetFavoriteGame(tpId, gameId, isRemove);
		}
	};

	SelectNav = navKey => {
		if (this.state.selNav !== navKey) {
			this.setState(
				{
					selNav: navKey,
					displayGames: null,
					totalCount: 0,
					hasMore: true,
					displayedCount: 0
				},
				() => {
					this.SetMoreItems();
				}
			);
		}
	};

	CloseSelGame = () => {
		if (this.mounted) {
			this.setState({ selGameInfo: null });
		}
	};

	SelectGame = (tpId, gameInfo) => {
		if (this.state.selGameInfo === null && this.mounted) {
			this.setState({
				selGameInfo: { tpId, ...gameInfo }
			});
		}
	};

	EditSearchField = (colName, v) => {
		if (
			JSON.stringify(this.state.searchInfo[colName]) !== JSON.stringify(v)
		) {
			let newData = {
				...this.state.searchInfo,
				[colName]: v
			};

			if (this.mounted) {
				this.setState(
					{
						searchInfo: newData,
						displayGames: [],
						totalCount: 0,
						hasMore: true,
						displayedCount: 0
					},
					() => {
						this.SetMoreItems();
					}
				);
			}
		}
	};

	matchKeyword = (name, _keyword) => {
		let keyword = _keyword.toLowerCase();
		return (
			Object.keys(name)?.filter(key => {
				return name[key].toLowerCase().indexOf(keyword) !== -1;
			}).length > 0
		);
	};

	FilterGames = (_searchInfo, _nav, initGameDatas, initTpList) => {
		let _gameDatas = initGameDatas ?? this.state.gameDatas;
		let _tpList = initTpList ?? this.state.tpList;
		let tpId = _searchInfo.provider.value;
		let gameCategory = _searchInfo.gameType.value;
		let searchText = _searchInfo.searchText;

		const matchFilter = (tpId, g) => {
			let matchNav =
				(_nav === defNav.PROMO.key && g.promotion === 1) ||
				(_nav === defNav.FEATURED.key && g.featured === true) ||
				(_nav === defNav.FAVOURITE.key &&
					this.state.favorite.includes(`${tpId}_${g.gameId}`)) ||
				_nav === defNav.ALLGAMES.key;
			return (
				matchNav &&
				(gameCategory === null || g.category1 === gameCategory) &&
				(searchText === "" || this.matchKeyword(g.name, searchText))
			);
		};

		return _gameDatas?.filter(g => {
			let tp = _tpList[g.tpId];
			return (
				(tpId === null || tp.value === tpId) && matchFilter(tp.value, g)
			);
		});
	};

	ClickPlay = freePlay => {
		if (this.props.userInfo.isLogin) {
			GET_CASINO_ENTER_PAGE(
				this.state.selGameInfo.tpId,
				this.state.selGameInfo.gameId,
				freePlay,
				this.props.userInfo.langId
			);
		} else {
			this.props.setNav(defNavPanel.login);
		}
	};

	SetMoreItems = () => {
		let _searchInfo = this.state.searchInfo;
		let _selNav = this.state.selNav;
		let initGameDatas = this.state.gameDatas;
		let initTpList = this.state.tpList;
		const s = this.state;
		if (s.hasMore) {
			let _gameDatas = this.FilterGames(
				_searchInfo,
				_selNav,
				initGameDatas,
				initTpList
			);
			let restCount = _gameDatas?.length - s.displayedCount;
			let loadCount =
				restCount >= eachPageItem ? eachPageItem : restCount;
			let startIdx = s.displayedCount;
			let endIdx = startIdx + loadCount;

			let newItem = [];
			for (let i = startIdx; i < endIdx; i++) {
				newItem.push(_gameDatas[i]);
			}

			if (newItem.length !== 0 && this.mounted) {
				let new_count = s.displayedCount + newItem.length;
				if (this.mounted) {
					let displayGames = s.displayGames ?? [];
					this.setState({
						displayGames: [...displayGames, ...newItem],
						totalCount: _gameDatas?.length,
						hasMore: new_count < _gameDatas?.length,
						displayedCount: new_count
					});
				}
			} else {
				if (this.mounted) {
					if (s.displayGames === null) {
						this.setState({
							hasMore: false,
							displayGames: []
						});
					} else {
						this.setState({
							hasMore: false
						});
					}
				}
			}
		}

		this.trigger = false;
	};

	render() {
		return (
			<>
				<Slider />
				<Nav selNav={this.state.selNav} SelectNav={this.SelectNav} />
				<SearchBox
					TpList={this.state.tpList}
					{...this.state.searchInfo}
					EditSearchField={this.EditSearchField}
					DefaultProvider={this.props.tpId}
				/>

				<Games
					SelectGame={this.SelectGame}
					Games={this.state.displayGames}
					Favorite={this.state.favorite}
					SetFavorite={this.SetFavorite}
					TpList={this.state.tpList}
					i18n={this.props.i18n}
				/>

				{this.state.selGameInfo === null ? null : (
					<div className="slotFunction open">
						<div className="title text-org">
							{this.state.selGameInfo.name[
								this.props.userInfo.langId
							] ?? this.state.selGameInfo.name.en}
						</div>
						<button
							className="icon icon-cancel-circle"
							onClick={this.CloseSelGame}></button>
						<div className="btn-group">
							<button
								className="white"
								onClick={this.ClickPlay.bind(this, true)}>
								{this.props.i18n.lbl_Free}
							</button>
							<button
								className="orange"
								onClick={this.ClickPlay.bind(this, false)}>
								{this.props.i18n.lbl_PlayNow}
							</button>
						</div>
					</div>
				)}
			</>
		);
	}
}

const IndexPage = props => {
	const { i18n } = useContext(i18nContext);
	const { setNav } = useContext(navContext);
	const { userInfo } = useContext(userInfoContext);

	let tpId = props.tpId ?? props.location.state?.tpId;
	tpId = typeof tpId === "string" && !isNaN(tpId) ? Number(tpId) : tpId;
	return (
		<Panel i18n={i18n} userInfo={userInfo} setNav={setNav} tpId={tpId} />
	);
};

export default IndexPage;
