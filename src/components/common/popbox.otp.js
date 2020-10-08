import React, { useState, useContext, useRef, useEffect } from "react";
import { i18nContext, popBoxContext, userInfoContext } from "../common/context";
import { api_SendOTPSMS, api_VerifyOTP } from "../../service/api/accountStrict";
import moment from "moment";

const Panel = () => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const { setUserInfo } = useContext(userInfoContext);
	const [loading, setLoading] = useState(true);
	const [otpCode, setOtpCode] = useState("");
	const [startUnixTime, setStartUnixTime] = useState(null);
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
			api_SendOTPSMS().then(
				response => {
					if (isMountedRef.current) {
						if (response.data.errorCode === 0) {
							setStartUnixTime(response.data.data.startUnixTime);
							setTimer(true);
						} else if (response.data.errorCode === 5002) {
							setErrorMsg(i18n.msg_API_SendOTPSMS_5002);
						} else {
							setErrorMsg(response.data.message);
						}
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setLoading(false);
						setPopBox({
							isOpen: true,
							title: i18n.lbl_ImportantNote,
							content: i18n.msg_ApiServerError
						});
					}
				}
			);
		}
	}, []);

	const editInput = e => {
		let val = e.target.value;
		setOtpCode(val);
	};

	const checkValue = val => {
		let msg = val === "" ? i18n.msg_VerifyCodeTip : "";
		setWarning(msg);
	};

	const checkSubmit = async () => {
		checkValue(otpCode);

		if (otpCode !== "") {
			setLoading(true);
			clickSubmit(otpCode);
		}
	};

	const clickSubmit = async otpCode => {
		await api_VerifyOTP({
			inputOTPcode: otpCode
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setUserInfo(prev => ({
							...prev,
							phoneVerified: true
						}));

						setLoading(false);
						setPopBox({ isOpen: false });
					} else if (res.data.errorCode === 1000) {
						setLoading(false);
						setWarning(i18n.msg_OTP_Invalid);
					} else {
						setLoading(false);
						setPopBox({
							isOpen: true,
							content: res.data.message,
							hasBtn: true,
							btnBar: (
								<div className="btn-group">
									<button
										className="blue"
										onClick={closePopbox}>
										{i18n["lbl_Cancel"]}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setLoading(false);
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ApiServerError
					});
				}
			}
		);
	};

	const clickResend = () => {
		setLoading(true);
		api_SendOTPSMS().then(
			response => {
				if (isMountedRef.current) {
					if (response.data.errorCode === 0) {
						setWarning("");
						setStartUnixTime(response.data.data.startUnixTime);
						setTimer(true);
					} else if (response.data.errorCode === 5002) {
						setErrorMsg(i18n.msg_API_SendOTPSMS_5002);
					} else {
						setErrorMsg(response.data.message);
					}
					setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setLoading(false);
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
					<div className="btn-group">
						<button className="blue" onClick={closePopbox}>
							{i18n.lbl_Cancel}
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
							onBlur={e => checkValue(e.target.value)}
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
									<Counter
										startUnixTime={startUnixTime}
										timeStop={timeStop}
									/>
								</span>
							) : (
								<span>{i18n.lbl_Retransmit}</span>
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export const Counter = ({ startUnixTime, timeStop }) => {
	let now = moment().unix();
	const [count, setCount] = useState(startUnixTime + 300 - now);
	const timerRef = useRef(null);

	const secondsToTime = secondsInTime => {
		const pad = (num, size) => {
			return ("000" + num).slice(size * -1);
		};
		let time = parseFloat(secondsInTime).toFixed(3);
		let minutes = Math.floor(time / 60) % 60;
		let seconds = Math.floor(time - minutes * 60);
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
			timeStop();
		}
	}, [count, timeStop]);

	return ` ( ${secondsToTime(count)} ) `;
};

export default Panel;
