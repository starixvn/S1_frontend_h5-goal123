import React, { useState, useContext, Component, useEffect } from "react";
import {
	i18nContext,
	navContext,
	defNavPanel,
	userInfoContext,
	popBoxContext
} from "../common/context";
import productList from "../../datas/productList";
import { GET_ENTER_PAGE } from "../../service/enterPage";
import { Redirect, Link } from "@reach/router";
import { api_GetTpIds } from "../../service/api/site";
import path from "../../path";

const Category = props => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const { setNav } = useContext(navContext);
	const [redirect, setRedirect] = useState({
		redirect: false,
		path: ""
	});

	const { setPopBox } = useContext(popBoxContext);
	const [casinoTpIds, setCasinoTpIds] = useState(null);

	const clickGame = ({ tpId, gameId, path }) => {
		if (path) {
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

	useEffect(() => {
		let mounted = true;

		if (userInfo.isLogin) {
			api_GetTpIds().then(
				res => {
					if (res.data.errorCode === 0 && mounted) {
						setCasinoTpIds(res.data.data);
					}
				},
				err => {
					if (mounted) {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: i18n.msg_ApiServerError
						});
					}
				}
			);
		}

		return () => {
			mounted = false;
		};
	}, [userInfo.isLogin, i18n, setPopBox]);

	return redirect.redirect ? (
		<Redirect to={redirect.path} noThrow />
	) : (
		<CateGoryContent
			clickGame={clickGame}
			i18n={i18n}
			top={props.shortcutBarLocate?.bottom}
			casinoTpIds={casinoTpIds}
			userCurrencyId={userInfo.currencyId}
		/>
	);
};

class CateGoryContent extends Component {
	constructor(props) {
		super(props);
		this.state = { category: "sports" };
		this.mounted = false;
		this.RefItems = {};
		this.setCategory = false;
		productList.forEach(item => {
			this.RefItems[`${item.category}`] = {
				First: React.createRef(),
				Last: React.createRef()
			};
		});
		this.checkScrollTimer = null;
	}
	ScrollBarListener = () => {
		if (!this.setCategory) {
			this.setCategory = true;
			let currentCategory = null;
			Object.keys(this.RefItems).forEach(k => {
				let item =
					this.RefItems[k].Last.current ??
					this.RefItems[k].First.current;
				let x = item.getBoundingClientRect();

				if (
					x.bottom >= this.props.top + 50 &&
					currentCategory === null
				) {
					currentCategory = k;
				}
			});

			if (
				currentCategory !== null &&
				this.state.category !== currentCategory
			) {
				if (this.mounted) {
					this.setState(
						{ category: currentCategory },
						() => (this.setCategory = false)
					);
				}
			} else {
				this.setCategory = false;
			}
		}
	};
	checkScrolling = () => {
		if (this.checkScrollTimer !== null) {
			clearTimeout(this.checkScrollTimer);
		}
		this.checkScrollTimer = setTimeout(this.ScrollBarListener, 10);
	};
	componentWillUnmount() {
		this.mounted = false;
		window.removeEventListener("mousewheel", this.ScrollBarListener, false);
		window.removeEventListener("touchmove", this.ScrollBarListener, {
			passive: false
		});
		window.removeEventListener("scroll", this.checkScrolling, false);
	}
	componentDidMount() {
		this.mounted = true;
		window.addEventListener("mousewheel", this.ScrollBarListener, false);
		window.addEventListener("touchmove", this.ScrollBarListener, {
			passive: false
		});
		window.addEventListener("scroll", this.checkScrolling, false);
	}
	selectCategory = _category => {
		if (this.state.category !== _category) {
			this.setState({ category: _category });
		}
		let firstItem = this.RefItems[
			_category
		].First.current.getBoundingClientRect();

		const offset_y = -this.props.top;
		const y = firstItem.top + window.pageYOffset + offset_y;
		window.scrollTo({ top: y, behavior: "smooth" });
	};
	render() {
		let sideBarItems = [];
		let products = [];
		productList.forEach(item => {
			let _open = this.state.category === item.category;
			sideBarItems.push(
				<CategoryItem
					key={`category-${item.category}`}
					categoryIcon={item.categoryIcon}
					onClick={
						!item._blank
							? this.selectCategory.bind(null, item.category)
							: this.props.clickGame.bind(this, { ...item })
					}
					isOpen={`${_open ? " open" : ""}`}
					translation={this.props.i18n[item.translateKey]}
				/>
			);

			let content = item.items
				.filter(subItem => {
					let allowCurrency =
						this.props.userCurrencyId === null ||
						this.props.userCurrencyId === undefined ||
						subItem.allowCurrency === undefined ||
						subItem.allowCurrency.includes(
							this.props.userCurrencyId
						);

					return (
						allowCurrency &&
						(item.category === "casino"
							? this.props.casinoTpIds === null ||
							  this.props.casinoTpIds.includes(subItem.tpId)
							: true)
					);
				})
				.map((subItem, idx) => {
					let refItem =
						idx === 0
							? this.RefItems[item.category].First
							: idx === item.items.length - 1
							? this.RefItems[item.category].Last
							: null;
					let key = `product-tpId_${subItem.tpId}-gameId_${subItem.gameId}`;
					if (subItem.parameter) {
						return (
							<ProductLinkItem
								_ref={refItem}
								isShow={!item.className && _open}
								key={key}
								to={path.casino.root}
								parameter={subItem.parameter}
								img={subItem.img}
							/>
						);
					} else {
						return (
							<ProductItem
								_ref={refItem}
								isShow={!item.className && _open}
								key={key}
								clickGame={this.props.clickGame.bind(this, {
									...subItem
								})}
								img={subItem.img}
								spanText={this.props.i18n[subItem.spanTextKey]}
								icon={subItem.icon}
							/>
						);
					}
				});

			if (item.comingSoonImg && content.length % 2 !== 0) {
				content.push(
					<ComingSoonItem
						key={`product-${item.category}-comingsoon`}
						img={item.comingSoonImg}
					/>
				);
			}
			if (item.className) {
				products.push(
					<div
						key={`productGroup-${item.category}`}
						className={`${item.className}${_open ? " open" : ""}`}>
						{content}
					</div>
				);
			} else {
				products = [...products, ...content];
			}
		});

		return (
			<div className="content">
				<div className="sideBar">{sideBarItems}</div>
				<div className="gameList">{products}</div>
			</div>
		);
	}
}

const CategoryItem = props => {
	return (
		<button
			className={`icon icon-${props.categoryIcon}${props.isOpen}`}
			onClick={props.onClick}>
			<div>{props.translation}</div>
		</button>
	);
};

const ProductItem = props => {
	return (
		<a
			onClick={props.clickGame}
			ref={props._ref}
			className={props.isShow ? "open" : ""}>
			<img src={props.img} alt={props.icon ?? ""} />
			{props.spanText ? (
				<span className={`icon icon-${props.icon}`}>
					{props.spanText}
				</span>
			) : null}
		</a>
	);
};

const ProductLinkItem = props => {
	return (
		<Link
			to={`/${props.to}`}
			state={props.parameter}
			ref={props._ref}
			className={props.isShow ? "open" : ""}>
			<img src={props.img} alt={props.icon ?? ""} />
		</Link>
	);
};

const ComingSoonItem = props => {
	return (
		<a className={props.isShow ? "open" : ""}>
			<img src={props.img} alt="Coming Soon" />
		</a>
	);
};

export default Category;
