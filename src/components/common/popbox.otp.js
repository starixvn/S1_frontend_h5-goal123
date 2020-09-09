import React, { useState, useContext, useRef, useEffect } from "react";
import { i18nContext, popBoxContext } from "../common/context";
import { api_SendVerifySMS } from "../../service/api/accountStrict";

const Panel = ({ clickSubmit }) => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [loading, setLoading] = useState(true);
	const [otpCode, setOtpCode] = useState("");
	const [requestId, setRequestId] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [timer, setTimer] = useState(false);
	const [warning, setWarning] = useState("");
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (isMountedRef.current) {
			api_SendVerifySMS().then(
				response => {
					if (isMountedRef.current) {
						if (response.data.errorCode === 0) {
							setRequestId(response.data.message);
							setTimer(true);
						} else if (response.data.errorCode === 1004) {
							setErrorMsg(response.data.message);
							setTimer(true);
						} else {
							setErrorMsg(response.data.message);
						}
						setLoading(false);
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
	}, [i18n.lbl_ImportantNote, i18n.msg_ApiServerError, setPopBox]);

	const editInput = e => {
		let val = e.target.value;
		setOtpCode(val);
	};

	const checkValue = e => {
		let msg =
			e.target.value === "" ? "Please enter the verification number" : "";
		setWarning(msg);
	};

	const checkSubmit = () => {
		let msg = otpCode === "" ? "Please enter the verification number" : "";
		setWarning(msg);

		if (otpCode !== "" && requestId !== "") {
			clickSubmit(otpCode, requestId);
		}
	};

	const clickResend = () => {
		setTimer(true);
		api_SendVerifySMS().then(
			response => {
				if (isMountedRef.current) {
					if (response.data.errorCode === 0) {
						setRequestId(response.data.message);
					} else if (response.data.errorCode === 1004) {
						setErrorMsg(response.data.message);
						setTimer(true);
					} else {
						setErrorMsg(response.data.message);
					}
					setLoading(false);
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
	};

	const timeStop = () => {
		setTimer(false);
	};

	const closePopbox = () => {
		setPopBox({ isOpen: false });
	};

	return (
		<div className="popTxt">
			{loading ? (
				<div className="otpLoading">
					<i className="icon icon-spinner11"></i>
				</div>
			) : errorMsg ? (
				<>
					{errorMsg}
					{timer ? (
						<span>
							<Counter timeStop={timeStop} />
						</span>
					) : null}
					<div className="btn-group">
						<button className="blue" onClick={closePopbox}>
							{i18n["lbl_Cancel"]}
						</button>
					</div>
				</>
			) : (
				<div className="account">
					<div className="info">{i18n.msg_OTPSendCode}</div>
					<div className="inputBox btn-group otp">
						<input
							value={otpCode}
							onChange={editInput.bind(this)}
							onBlur={checkValue.bind(this)}
						/>
						<button className="orange" onClick={checkSubmit}>
							{i18n["lbl_Submit"]}
						</button>
					</div>
					{warning ? (
						<div className="errortip open">{warning}</div>
					) : null}
					<div className="btn-group">
						<button
							className="blue"
							onClick={clickResend}
							disabled={timer}>
							{timer ? (
								<Counter timeStop={timeStop} />
							) : (
								<span>Retransmit</span>
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export const Counter = props => {
	const [count, setCount] = useState(300);

	useEffect(() => {
		const interval = setInterval(() => {
			setCount(count => count - 1);
		}, 1000);

		if (count === 0) {
			clearInterval(interval);
			props.timeStop();
		}

		return () => {
			clearInterval(interval);
		};
	}, [count, props]);

	return <span>{" ( " + count + " )"}</span>;
};

export default Panel;
