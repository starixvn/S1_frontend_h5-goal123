import React, { useContext } from "react";
import { Link, Match } from "@reach/router";
import { userInfoContext, i18nContext } from "../common/context";
import path from "../../path";

const defChatLangSubUrl = {
	en: 1,
	id: 2,
	cs: 3,
	th: 4
};

const Footer = () => {
	const { userInfo } = useContext(userInfoContext);
	const { i18n } = useContext(i18nContext);
	if (userInfo.isLogin === false) {
		return (
			<footer>
				<Match path={path.promotion.root}>
					{props => {
						let isMatch = props.match !== null;
						return (
							<Link
								to={path.promotion.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-gift"></div>
								</div>
								<span>{i18n.lbl_Promotion}</span>
							</Link>
						);
					}}
				</Match>

				<Match path={path.home.root}>
					{props => {
						let isMatch = props.match !== null;
						return (
							<Link
								to={path.home.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-home"></div>
								</div>
								<span>{i18n.lbl_Home}</span>
							</Link>
						);
					}}
				</Match>

				{/* <a
					target="_blank"
					href="https://direct.lc.chat/11638088/"
					className="">
					<div className="circleAnimation">
						<div className="icon icon-contact"></div>
					</div>
					<span>{i18n.lbl_LiveChat}</span>
				</a> */}
				<Match path={path.setting.root}>
					{props => {
						let isMatch =
							props.location.pathname ===
								`/${path.setting.root}` ||
							props.location.pathname ===
								`/${path.setting.root}/${path.setting.sub.other.root}`;
						return (
							<Link
								to={path.setting.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-cog"></div>
								</div>
								<span>{i18n.lbl_Setting}</span>
							</Link>
						);
					}}
				</Match>
			</footer>
		);
	} else {
		return (
			<footer>
				<Match path={path.promotion.root}>
					{props => {
						let isMatch = props.match !== null;
						return (
							<Link
								to={path.promotion.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-gift"></div>
								</div>
								<span>{i18n.lbl_Promotion}</span>
							</Link>
						);
					}}
				</Match>

				<Match path={path.statement.root}>
					{props => {
						let isMatch = props.match !== null;
						return (
							<Link
								to={path.statement.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-statement1"></div>
								</div>
								<span>{i18n.lbl_Statement}</span>
							</Link>
						);
					}}
				</Match>

				<Match path={path.home.root}>
					{props => {
						let isMatch = props.match !== null;
						return (
							<Link
								to={path.home.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-home"></div>
								</div>
								<span>{i18n.lbl_Home}</span>
							</Link>
						);
					}}
				</Match>

				<a
					target="_blank"
					href={`https://direct.lc.chat/11638088/${
						defChatLangSubUrl[userInfo.langId] ?? ""
					}`}
					className="">
					<div className="circleAnimation">
						<div className="icon icon-contact"></div>
					</div>
					<span>{i18n.lbl_LiveChat}</span>
				</a>

				<Match path={path.member.root}>
					{props => {
						let isMatch =
							props.location.pathname ===
								`/${path.member.root}` ||
							props.location.pathname ===
								`/${path.member.root}/${path.member.sub.bankInfo.root}`;
						return (
							<Link
								to={path.member.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-member"></div>
								</div>
								<span>{i18n.lbl_Me}</span>
							</Link>
						);
					}}
				</Match>
				<Match path={path.setting.root}>
					{props => {
						let isMatch =
							props.location.pathname ===
								`/${path.setting.root}` ||
							props.location.pathname ===
								`/${path.setting.root}/${path.setting.sub.other.root}`;
						return (
							<Link
								to={path.setting.root}
								className={isMatch ? "open" : ""}>
								<div className="circleAnimation">
									<div className="icon icon-cog"></div>
								</div>
								<span>{i18n.lbl_Setting}</span>
							</Link>
						);
					}}
				</Match>
			</footer>
		);
	}
};

export default Footer;
