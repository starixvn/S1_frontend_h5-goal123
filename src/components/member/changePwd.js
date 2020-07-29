import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, Redirect } from "@reach/router";
import { i18nContext, popBoxContext } from "../common/context";
import { api_ChangePassword } from "../../service/api/account";
import path from "../../path";
import Inputbox from "../common/inputbox.password";

const initState = {
	oldPsw: "",
	newPsw: ""
};

const initWarningState = {
	oldPsw: {
		status: false,
		msg: ""
	},
	newPsw: {
		status: false,
		msg: ""
	}
};

const initPswState = {
	oldPsw: false,
	newPsw: false
};

export default () => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userValueState, setUserValueState] = useState(initState);
	const [warningState, setWarningState] = useState(initWarningState);
	const [pswState, setPswState] = useState(initPswState);
	const isMountedRef = useRef(null);
	const [redirectPath, setRedirectPath] = useState(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(`/${path.member.root}`);
		}
	}, [redirectPath]);

	const showPswHandler = col => {
		setPswState(prevState => ({
			...prevState,
			[col]: !pswState[col]
		}));
	};

	const passwordCheck = val => {
		let checked = false;
		let message = "";

		const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;
		if (val === "") {
			checked = false;
			message = i18n.msg_PasswordReq;
		} else if (val !== null) {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				message = i18n["msg_PasswordLength"];
			} else if (!regx.test(val)) {
				checked = false;
				message = i18n["msg_PasswordVaildate"];
			} else {
				checked = true;
			}
		}

		return { checked, message };
	};

	const checkPswHandler = (colName, e) => {
		const val = e.target.value;
		let result = passwordCheck(val);

		setWarningState(prevState => {
			return {
				...prevState,
				[colName]: {
					status: !result.checked,
					msg: result.message
				}
			};
		});
	};

	const EditField = (colName, e) => {
		let value = e.target.value;

		setUserValueState(prevState => ({
			...prevState,
			[colName]: value
		}));
	};

	const clickSubmit = () => {
		let oldPsw = passwordCheck(userValueState.oldPsw);
		let newPsw = passwordCheck(userValueState.newPsw);

		if (oldPsw.checked && newPsw.checked) {
			const closePopbox = status => {
				setPopBox({ isOpen: false });
				if (status === "success") {
					setRedirectPath(`/${path.member.root}`);
				}
			};

			api_ChangePassword({
				OldPassword: userValueState.oldPsw,
				NewPassword: userValueState.newPsw
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message,
								hasBtn: true,
								btnBar: (
									<div className="btn-group">
										<button
											className="orange"
											onClick={closePopbox.bind(
												null,
												"success"
											)}>
											{i18n["lbl_Confirm"]}
										</button>
									</div>
								)
							});
						} else {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message,
								hasBtn: true,
								btnBar: (
									<div className="btn-group">
										<button
											className="orange"
											onClick={closePopbox}>
											{i18n["lbl_Confirm"]}
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
		} else {
			setWarningState(prevState => {
				return {
					oldPsw: {
						status: !oldPsw.checked,
						msg: oldPsw.message
					},
					newPsw: { status: !newPsw.checked, msg: newPsw.message }
				};
			});
		}
	};

	return redirectPath !== null ? (
		<Redirect to={redirectPath} noThrow />
	) : (
		<>
			<Inputbox
				icon="icon-key"
				inputType={`${!pswState.oldPsw ? "password" : "text"}`}
				placeholder={i18n.lbl_OldPassword}
				onBlur={checkPswHandler.bind(null, "oldPsw")}
				onChange={EditField.bind(null, "oldPsw")}
				showPsw={pswState.oldPsw}
				showPswHandler={showPswHandler.bind(null, "oldPsw")}
				ClassName="LoginRule "
				Warning={warningState.oldPsw}
				value={userValueState.oldPsw}
			/>
			<Inputbox
				icon="icon-key"
				inputType={`${!pswState.newPsw ? "password" : "text"}`}
				placeholder={i18n.lbl_NewPassword}
				onBlur={checkPswHandler.bind(null, "newPsw")}
				onChange={EditField.bind(null, "newPsw")}
				showPsw={pswState.newPsw}
				showPswHandler={showPswHandler.bind(null, "newPsw")}
				ClassName="LoginRule "
				Warning={warningState.newPsw}
				value={userValueState.newPsw}
			/>
			<div className="btn-group">
				<Link className="white" to={`/${path.member.root}`}>
					{i18n.lbl_Back}
				</Link>
				<button className="orange" onClick={clickSubmit}>
					{i18n.lbl_Submit}
				</button>
			</div>
		</>
	);
};
