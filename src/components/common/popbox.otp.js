import React, { useState, useContext, useRef, useEffect } from "react";
import { i18nContext, popBoxContext } from "../common/context";
import { api_SendVerifySMS } from "../../service/api/accountStrict";
import { ReplaceStr } from "../../i18n/config";

const initErrMsg = { specialStatus: false, msg: "" };

const Panel = ({ clickSubmit, resetUserInfo, userInfo }) => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const [loading, setLoading] = useState(true);
	const [otpCode, setOtpCode] = useState("");
	const [requestId, setRequestId] = useState("");
	const [errorMsg, setErrorMsg] = useState(initErrMsg);
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
							if (userInfo.langId === "en") {
								setErrorMsg(i18n.msg_API_SendVerifySMS_1004);
							} else {
								setErrorMsg({
									specialStatus: true,
									msg: i18n.msg_API_SendVerifySMS_1004
								});
							}
							setTimer(true);
						} else if (response.data.errorCode === 5001) {
							resetUserInfo();
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

	const checkSubmit = async () => {
		let msg = otpCode === "" ? "Please enter the verification number" : "";
		setWarning(msg);

		if (otpCode !== "" && requestId !== "") {
			setLoading(true);

			await clickSubmit(otpCode, requestId);
			setLoading(false);
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
			) : errorMsg.msg !== "" ? (
				<>
					{errorMsg.specialStatus ? (
						<Counter
							timeStop={timeStop}
							specialStatus={errorMsg.specialStatus}
							msg={errorMsg.msg}
						/>
					) : (
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
					)}
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
							{i18n.lbl_Submit}
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
								<span>
									<Counter timeStop={timeStop} />
								</span>
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
	const timerRef = useRef(null);

	const secondsToTime = secondsInTime => {
		const pad = (num, size) => {
			return ("000" + num).slice(size * -1);
		};
		let time = parseFloat(secondsInTime).toFixed(3);
		let hours = Math.floor(time / 60 / 60);
		let minutes = Math.floor(time / 60) % 60;
		let seconds = Math.floor(time - minutes * 60);
		let milliseconds = time.slice(-3);
		return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setCount(count => count - 1);
		}, 1000);
		timerRef.current = interval;

		return () => {
			clearInterval(timerRef.current);
		};
	}, []);

	useEffect(() => {
		if (count === 0) {
			clearInterval(timerRef.current);
			props.timeStop();
		}
	}, [count]);

	if (props.specialStatus) {
		let _count = ReplaceStr(props.msg, {
			timer: ` ( ${secondsToTime(count)} ) `
		});
		return _count;
	}
	return ` ( ${secondsToTime(count)} ) `;
};

export default Panel;
