import React, { useState, useContext, useEffect, useRef } from "react";
import Inputbox from "../common/inputbox";
import InputboxPWD from "../common/inputbox.password";
import { LOGIN } from "../../service/auth";
import {
	userInfoContext,
	i18nContext,
	navContext,
	defNavPanel
} from "../common/context";
import { useMatch, Redirect, Link } from "@reach/router";
import path from "../../path";
import config from "../../config";
import Logo from "../../styles/img/logo.png";

const initState = {
	UserName: "",
	Password: "",
	Checkbox: false
};

const initWarningState = {
	UserName: {
		status: false,
		msg: ""
	},
	Password: {
		status: false,
		msg: ""
	},
	Checkbox: {
		status: false,
		msg: ""
	}
};

const warningLangKey = {
	UserName: "msg_UsernameReq",
	Password: "msg_PasswordReq"
};

const LoginPage = ({ ButtonTitle }) => {
	const { i18n } = useContext(i18nContext);
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { nav, setNav } = useContext(navContext);
	const [userValueState, setUserValueState] = useState(initState);
	const [redirectPath, setRedirectPath] = useState(null);
	const [pswState, setPswState] = useState(false);
	const [warningState, setWarningState] = useState(initWarningState);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(null);
		}
	}, [redirectPath]);

	const checkValueHandler = (colName, e) => {
		let val = e.target.value;
		setWarningState(prevState => {
			return {
				...prevState,
				[colName]: {
					...prevState[colName],
					status: val === "",
					msg: i18n[warningLangKey[colName]]
				}
			};
		});
	};

	const showPswHandler = () => {
		setPswState(!pswState);
	};

	const handleLogin = () => {
		let checked =
			userValueState.UserName !== "" && userValueState.Password !== "";

		setWarningState(prevState => {
			return {
				...prevState,
				UserName: {
					...prevState.UserName,
					status: userValueState.UserName === "",
					msg: i18n[warningLangKey.UserName]
				},
				Password: {
					...prevState.Password,
					status: userValueState.Password === "",
					msg: i18n[warningLangKey.Password]
				}
			};
		});

		if (checked) {
			const CallBackLogin = (errorCode, message, isLogin, userData) => {
				if (errorCode === 0) {
					if (isMountedRef.current) {
						setUserInfo(() => ({
							...userData,
							isLogin: isLogin
						}));
						setNav(null);
					}
				} else if (
					errorCode === 1101 ||
					errorCode === 1102 ||
					errorCode === 9000
				) {
					if (isMountedRef.current) {
						setWarningState(prevState => ({
							...prevState,
							UserName: { status: true, msg: message }
						}));
					}
				} else if (errorCode === 1001) {
					if (isMountedRef.current) {
						setWarningState(prevState => ({
							...prevState,
							Password: { status: true, msg: message }
						}));
					}
				}
			};

			LOGIN(
				{
					userName: userValueState.UserName,
					password: userValueState.Password,
					langId: userInfo.langId
				},
				CallBackLogin
			);
		}
	};

	const handleloginPanel = (show, reset, showBylink) => {
		if (reset) {
			setUserValueState(initState);
			setWarningState(initWarningState);
		}

		if (showBylink) {
			setRedirectPath("/");
		} else {
			setNav(() => {
				let newState = show ? null : defNavPanel.login;
				return newState;
			});
		}
	};

	let showBylink = useMatch(path.login.root) !== null;
	let showPanel = showBylink || nav === defNavPanel.login;

	const EditField = (colName, e) => {
		let value = e.target.value;
		setUserValueState(prevState => ({
			...prevState,
			[colName]: value
		}));
	};

	return redirectPath === null ? (
		<>
			<button onClick={handleloginPanel.bind(this, showPanel)}>
				{ButtonTitle}
			</button>
			<div className={`Login${showPanel ? " open" : ""}`}>
				<div
					className={`close${showPanel ? " open" : ""}`}
					onClick={handleloginPanel.bind(
						this,
						showPanel,
						true,
						showBylink
					)}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>

				<img src={Logo} alt={config.siteName} />
				<div className="title">{i18n["lbl_Login"]}</div>

				<Inputbox
					icon="icon-member"
					inputType="text"
					placeholder={i18n["lbl_Username"]}
					onBlur={checkValueHandler.bind(null, "UserName")}
					onChange={EditField.bind(null, "UserName")}
					ClassName="JoinRule"
					Warning={warningState.UserName}
					value={userValueState.UserName}
				/>

				<InputboxPWD
					icon="icon-key"
					inputType={`${!pswState ? "password" : "text"}`}
					placeholder={i18n["lbl_Password"]}
					onBlur={checkValueHandler.bind(null, "Password")}
					onChange={EditField.bind(null, "Password")}
					showPsw={pswState}
					showPswHandler={showPswHandler}
					ClassName="JoinRule"
					Warning={warningState.Password}
					value={userValueState.Password}
				/>

				<div className="Terms">
					<Link
						to={path.forgetPassword.root}
						onClick={handleloginPanel.bind(
							this,
							showPanel,
							true,
							showBylink
						)}>
						{i18n.lbl_ForgetPassword}?
					</Link>
				</div>

				<button onClick={handleLogin}>{i18n["lbl_Login"]}</button>
			</div>
		</>
	) : (
		<Redirect to="/" noThrow />
	);
};

export default LoginPage;
