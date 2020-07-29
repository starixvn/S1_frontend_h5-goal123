import React, { Component, useContext, createRef } from "react";
import { api_GetAnnouncement } from "../../service/api/message";
import PropTypes from "prop-types";
import {
	popBoxContext,
	userInfoContext,
	navContext,
	defNavPanel,
	i18nContext
} from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import path from "../../path";
import { Redirect } from "@reach/router";

const Panel = () => {
	const { nav, setNav } = useContext(navContext);
	const { i18n } = useContext(i18nContext);

	const OpenLoginPanel = () => {
		setNav(() => {
			return defNavPanel.login;
		});
	};

	const { popBox, setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	let langId = GET_LANG_ID(userInfo.langId);

	return (
		<Marquee
			nav={nav}
			OpenLoginPanel={OpenLoginPanel}
			setPopBox={setPopBox}
			userIsLogin={userInfo.isLogin}
			langId={langId}
			popBoxIsOpen={popBox.isOpen}
			i18n={i18n}
		/>
	);
};

class Marquee extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datas: [],
			hover: false,
			pos: null,
			initWidth: 0,
			nav: this.props.nav,
			redirectPath: null
		};
		this.isMountedRef = false;
		this.marquee = createRef();
		this.content = createRef();
	}
	shouldComponentUpdate = (nextProps, nextState) => {
		if (this.props.langId !== nextProps.langId) {
			this.GetAnnouncement(nextProps.langId);
		}
		return true;
	};
	componentDidMount = () => {
		this.isMountedRef = true;
		this.GetAnnouncement(this.props.langId);
		this.intervalId = setInterval(
			this.GetAnnouncement.bind(this, this.props.langId),
			60000
		);
	};
	SetPos = () => {
		if (
			this.isMountedRef &&
			!this.props.popBoxIsOpen &&
			this.state.prev !== null
		) {
			// let style = window.getComputedStyle(this.content.current, null);
			// let outerBox = parseFloat(style.width);
			let style = window.getComputedStyle(this.marquee.current, null);
			let outerBox = parseFloat(style.width);
			this.setState(prev => {
				if (prev.pos <= -outerBox) {
					let _style = window.getComputedStyle(
						this.content.current,
						null
					);
					let contentBox = parseFloat(_style.width);
					return { pos: contentBox };
				} else {
					return { pos: prev.pos - 1.5 };
				}
			});
		}
	};
	componentWillUnmount = () => {
		this.isMountedRef = false;
		clearInterval(this.intervalId_Pos);
	};
	componentDidUpdate = () => {
		if (this.state.pos === null && this.isMountedRef) {
			let style = window.getComputedStyle(this.marquee.current, null);
			let pos = parseFloat(style.width);

			this.setState({ pos: -pos, initWidth: pos });
		}
	};
	GetAnnouncement = langId => {
		api_GetAnnouncement(langId).then(
			res => {
				if (res.data.errorCode === 0) {
					let resData = res.data.data;
					let stateData = this.state.datas;
					let upd = false;
					if (resData.length !== 0 && stateData.length !== 0) {
						for (let d in resData) {
							let find = stateData.find(
								x =>
									x.id === resData[d].id &&
									x.subject === resData[d].subject &&
									x.content === resData[d].content
							);

							if (!find) {
								upd = true;
								break;
							}
						}
					} else {
						upd = true;
					}

					if (upd) {
						if (this.intervalId_Pos === undefined) {
							this.intervalId_Pos = setInterval(this.SetPos, 25);
						}

						if (this.isMountedRef) {
							this.setState({
								datas: res.data.data.map(item => {
									return {
										...item,
										subject: item.subject,
										content: item.content
									};
								})
							});
						}
					}
				} else if (this.isMountedRef) {
					this.props.setPopBox({
						isOpen: true,
						title: this.props.i18n.lbl_ImportantNote,
						content: res.data.message
					});
				}
			},
			err => {
				if (this.isMountedRef) {
					this.props.setPopBox({
						isOpen: true,
						title: this.props.i18n.lbl_ImportantNote,
						content: this.props.i18n.msg_ApiServerError
					});
				}
			}
		);
	};
	ClickMarquee = item => {
		if (this.props.userIsLogin) {
			let content = item.content.split("\\n").join("　");
			const GoToAnnouncement = () => {
				this.props.setPopBox({
					isOpen: false
				});
				this.setState({
					redirectPath: `/${path.message.root}/${path.message.sub.announcement.root}`
				});
			};
			this.props.setPopBox({
				isOpen: true,
				title: item.subject,
				content: content,
				hasBtn: true,
				btnBar: (
					<div className="btn-group">
						<button className="blue" onClick={GoToAnnouncement}>
							{this.props.i18n["lbl_More"] ?? "More"}
						</button>
					</div>
				)
			});
		} else {
			this.props.OpenLoginPanel();
		}
	};
	render() {
		let rows = this.state.datas.map(item => {
			return (
				<button
					key={`announcement-${item.id}`}
					style={{ paddingLeft: "2rem" }}
					onClick={this.ClickMarquee.bind(this, item)}>
					{item.subject}
				</button>
			);
		});

		let style = this.state.pos === null ? {} : { left: this.state.pos };
		return this.state.redirectPath === null ? (
			<div id="Marquee">
				<div className="icon icon-marquee"></div>
				<div ref={this.content} className="marquee-box">
					<div
						className="marquee-run"
						ref={this.marquee}
						style={style}>
						{rows}
					</div>
				</div>
			</div>
		) : (
			<Redirect to={this.state.redirectPath} noThrow />
		);
	}
}

Marquee.defaultProps = {
	langId: `en`,
	userIsLogin: true
};

Marquee.propTypes = {
	langId: PropTypes.string,
	userIsLogin: PropTypes.bool,
	setPopBox: PropTypes.func,
	popBoxIsOpen: PropTypes.bool
};

export default Panel;
