import React, { useState, useContext, useEffect, useRef } from "react";
import { i18nContext, popBoxContext } from "../common/context";
import { api_ForgetPwd } from "../../service/api/site";
import Inputbox from "../common/inputbox";
import { Redirect } from "@reach/router";
import path from "../../path";

export default () => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userEmail, setUserEmail] = useState("");
	const [warning, setWarning] = useState({ status: false, msg: "" });
	const isMountedRef = useRef(null);
	const [redirectPath, setRedirectPath] = useState(null);

	useEffect(() => {
		if (isMountedRef.current && redirectPath !== null) {
			setRedirectPath(null);
		}
	}, [redirectPath]);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const EditField = e => {
		let val = e.target.value;
		setUserEmail(val);
	};

	const checkEmailHandler = e => {
		let val = e.target.value;
		let checked = true;
		let message = "";
		const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (val === "") {
			checked = false;
			message = i18n.msg_MailWrongFormat;
		} else if (val !== null) {
			if (!regx.test(val)) {
				checked = false;
				message = i18n.msg_MailWrongFormat;
			}
		}

		setWarning({ status: !checked, msg: message });
	};

	const clickSubmit = () => {
		if (userEmail === "") {
			setWarning({ status: true, msg: i18n.msg_MailWrongFormat });
		} else if (!warning.status) {
			api_ForgetPwd({ Email: userEmail }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode !== 0) {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message
							});
						} else {
							setPopBox({
								isOpen: true,
								title: i18n.lbl_ImportantNote,
								content: res.data.message
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

	const ClickBack = () => {
		setRedirectPath(`/${path.login.root}`);
	};

	return redirectPath === null ? (
		<>
			<Inputbox
				icon="icon-email"
				inputType="text"
				placeholder={i18n["lbl_Email"]}
				value={userEmail}
				onChange={EditField.bind(null)}
				onBlur={checkEmailHandler.bind(null)}
				Warning={warning}
				ClassName="LoginRule"
			/>
			<div className="btn-group">
				<button className="white" onClick={ClickBack}>
					{i18n.lbl_Back}
				</button>
				<button className="orange" onClick={clickSubmit}>
					{i18n.lbl_Submit}
				</button>
			</div>
		</>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
