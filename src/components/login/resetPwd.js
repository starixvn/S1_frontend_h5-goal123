import React, { useState, useContext, useEffect, useRef } from "react";
import { i18nContext, popBoxContext, userInfoContext } from "../common/context";
import { api_ResetPassword } from "../../service/api/accountStrict";
import { api_CheckResetPwdToken } from "../../service/api/site";
import Inputbox from "../common/inputbox.password";
import { getUrlParameter } from "../common/common";
import { Redirect } from "@reach/router";

export default () => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const { setUserInfo } = useContext(userInfoContext);
	const [newPsw, setNewPsw] = useState("");
	const [pswState, setPswState] = useState(false);
	const [warning, setWarning] = useState({ status: false, msg: "" });
	const [redirectPath, setRedirectPath] = useState(null);
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

	useEffect(() => {
		let key = getUrlParameter("key");
		if (key) {
			api_CheckResetPwdToken(key).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 1) {
							setRedirectPath("/");
							setUserInfo(prevState => ({
								...prevState,
								isLogin: true
							}));
						} else if (res.data.errorCode === 0) {
							setUserInfo(prevState => ({
								...prevState,
								isLogin: true
							}));
						} else {
							setRedirectPath("/");
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: i18n.msg_ApiServerError
							});
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: i18n.msg_ApiServerError
						});
					}
				}
			);
		} else {
			if (isMountedRef.current) {
				setRedirectPath("/");
			}
		}
	}, [redirectPath, i18n, setPopBox, setUserInfo]);

	const showPswHandler = () => {
		setPswState(!pswState);
	};

	const EditField = e => {
		let val = e.target.value;
		setNewPsw(val);
	};

	const checkPswHandler = e => {
		let val = e.target.value;
		let checked = true;
		let message = "";
		const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;

		if (val === "") {
			checked = false;
			message = i18n.msg_PasswordReq;
		} else if (val != null) {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				message = i18n.msg_PasswordLength;
			} else if (!regx.test(val)) {
				checked = false;
				message = i18n.msg_PasswordVaildate;
			}
		}

		setWarning({ status: !checked, msg: message });
	};

	const clickSubmit = () => {
		if (newPsw === "") {
			setWarning({ status: true, msg: i18n.msg_PasswordVaildate });
		} else if (warning.status === false) {
			api_ResetPassword({ NewPassword: newPsw }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode !== 0) {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message
							});
						} else {
							const RedirectToHome = () => {
								setRedirectPath("/");
								setPopBox({ isOpen: false });
							};
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message,
								hideCloseBtn: true,
								hasBtn: true,
								btnBar: (
									<div className="btn-group">
										<button
											className="orange"
											onClick={RedirectToHome}>
											OK
										</button>
									</div>
								)
							});
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: i18n.msg_ApiServerError
						});
					}
				}
			);
		}
	};

	return redirectPath === null ? (
		<>
			<Inputbox
				icon="icon-key"
				inputType={`${!pswState ? "password" : "text"}`}
				placeholder={i18n.lbl_Password}
				value={newPsw}
				onChange={EditField.bind(null)}
				onBlur={checkPswHandler.bind(null)}
				Warning={warning}
				showPsw={pswState}
				showPswHandler={showPswHandler}
				ClassName="LoginRule"
			/>
			<div className="btn-group">
				<button className="orange" onClick={clickSubmit}>
					{i18n.lbl_Submit}
				</button>
			</div>
		</>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
