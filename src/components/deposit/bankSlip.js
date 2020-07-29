import React, { useContext, Component, useEffect, useRef } from "react";
import {
	bankSlipPopBoxContext,
	i18nContext,
	popBoxContext
} from "../common/context";
import moment from "moment";
import ClipboardJS from "../../lib/clipboard.min";
import {
	api_UploadReceipt,
	api_SetDepositReceipt
} from "../../service/api/payment";

const GetUploadFileName = files => {
	let fullPath = files[0].name;
	var startIndex =
		fullPath.indexOf("\\") >= 0
			? fullPath.lastIndexOf("\\")
			: fullPath.lastIndexOf("/");
	var filename = fullPath.substring(startIndex);
	if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
		filename = filename.substring(1);
	}
	return filename;
};

class Modal extends Component {
	state = { processing: false };
	isMountedRef = false;
	filebox = React.createRef();
	componentDidMount() {
		/* eslint-disable */
		this.isMountedRef = true;
		this._clipboard = new ClipboardJS(".copyBtn");
		this._clipboard.on("success", e => {});
		this._clipboard.on("error", e => {});
		/* eslint-enable */
	}
	componentWillUnmount() {
		this.isMountedRef = false;
		this._clipboard.destroy();
	}
	onCheckUpload = () => {
		let files = this.filebox.current.files;
		if (files[0]) {
			this.setState({
				UploadDisabled: files.length <= 0
			});
			this.props.EditField("picFileName", GetUploadFileName(files));
		}
	};
	onUploadFile = () => {
		let files = this.filebox.current.files;
		if (files.length > 0) {
			this.setState({ UploadDisabled: false });
			let formData = new FormData();
			formData.append("TransId", this.props.bankSlipPopBox.transId);
			formData.append("Receipt", files[0]);
			api_UploadReceipt(formData).then(
				response => {
					if (this.isMountedRef) {
						let result = response.data;
						if (result.errorCode === 0) {
							alert(this.props.i18n.lbl_UploadSuccess);
						} else {
							alert(result.message);
						}
					}
				},
				err => {
					if (this.isMountedRef) {
						this.props.setPopBox({
							isOpen: true,
							title: this.props.i18n.lbl_ImportantNote,
							content: "API Server Error."
						});
					}
				}
			);
		} else {
			this.setState({ UploadDisabled: true });
		}
	};
	EditField = (column, e) => {
		this.props.EditField(column, e.target.value);
	};
	SeReceipt = () => {
		if (!this.state.processing) {
			this.setState({ processing: true });
			let bankSlipPopBox = this.props.bankSlipPopBox;
			api_SetDepositReceipt(
				bankSlipPopBox.transId,
				moment(bankSlipPopBox.depositTime).unix(),
				bankSlipPopBox.refId
			).then(
				res => {
					if (this.isMountedRef) {
						if (res.data.errorCode === 0) {
							this.props.handlePopBox();
						} else {
							alert(res.message);
						}

						this.setState({ processing: false });
					}
				},
				err => {
					if (this.isMountedRef) {
						this.props.setPopBox({
							isOpen: true,
							title: this.props.i18n.lbl_ImportantNote,
							content: "API Server Error."
						});

						this.setState({ processing: false });
					}
				}
			);
		}
	};
	render() {
		let bankSlipPopBox = this.props.bankSlipPopBox;
		let i18n = this.props.i18n;
		return (
			<div
				className={`bankSlip popUp${
					bankSlipPopBox.isOpen ? " open" : ""
				}`}>
				<div className="info infoAccount">
					<ul>
						<li>
							<div>
								<div className="bankLogo acb"></div>
								<span>{bankSlipPopBox.bankName}</span>
							</div>
							<a
								className="icon icon-new-tab clickBtn"
								target="_blank"
								rel="noreferrer noopener"
								href={bankSlipPopBox.bankSite}></a>
						</li>
						<li>
							<div>
								<span className="title">
									{i18n.lbl_BankAccountName}
								</span>
								<span>{bankSlipPopBox.accountName}</span>
							</div>
							<button
								className="icon icon-files-empty clickBtn copyBtn"
								data-clipboard-text={
									bankSlipPopBox.accountName
								}></button>
						</li>
						<li>
							<div>
								<span className="title">
									{i18n.lbl_BankNumber}
								</span>
								<span>{bankSlipPopBox.accountNo}</span>
							</div>
							<button
								className="icon icon-files-empty clickBtn copyBtn"
								data-clipboard-text={
									bankSlipPopBox.accountNo
								}></button>
						</li>
						<li>
							<div>
								<span className="title">
									{i18n.lbl_DepositAmount}
								</span>
								<span>{bankSlipPopBox.amount}</span>
							</div>
							<button
								className="icon icon-files-empty clickBtn copyBtn"
								data-clipboard-text={
									bankSlipPopBox.amount
								}></button>
						</li>
					</ul>
				</div>
				<span className="text">{i18n.lbl_AttachFile}</span>
				<div className="btn-group">
					<label className="fileUpload">
						<input
							type="file"
							ref={this.filebox}
							accept="image/*"
							onChange={this.onCheckUpload}
						/>
						<i className="icon icon-folder-upload"></i>
						{` ${
							this.props.bankSlipPopBox.picFileName ??
							i18n.msg_SelectFile
						} `}
					</label>
					<button className="orange" onClick={this.onUploadFile}>
						{i18n.lbl_UploadFile}
					</button>
				</div>
				<span className="text">
					{i18n.lbl_DepositTime}{" "}
					<span className="text-org">({moment().format("Z")})</span>
				</span>
				<div className="inputBox">
					<i className="icon icon-calendar"></i>
					<input
						placeholder={i18n.msg_SubmitDepositTime}
						type="datetime-local"
						value={this.props.bankSlipPopBox.depositTime ?? ""}
						onChange={this.EditField.bind(this, "depositTime")}
					/>
				</div>
				<span className="text">{i18n.lbl_RefnoToolTip}</span>
				<div className="inputBox">
					<i className="icon icon-pencil"></i>
					<input
						placeholder={i18n.msg_ReferenceNumber}
						value={this.props.bankSlipPopBox.refId ?? ""}
						onChange={this.EditField.bind(this, "refId")}
					/>
				</div>
				<div className="btn-group">
					<button
						className="blue closePopup"
						onClick={this.props.handlePopBox}>
						{i18n.lbl_Cancel}
					</button>
					<button
						className="orange closePopup"
						onClick={this.SeReceipt}>
						{i18n.lbl_Submit}
					</button>
				</div>
			</div>
		);
	}
}

const Panel = () => {
	const { i18n } = useContext(i18nContext);
	const { setPopBox } = useContext(popBoxContext);
	const { bankSlipPopBox, setbankSlipPopBox } = useContext(
		bankSlipPopBoxContext
	);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const handlePopBox = () => {
		if (isMountedRef.current) {
			if (bankSlipPopBox.closeCallBack) {
				bankSlipPopBox.closeCallBack();
			}
			setbankSlipPopBox(() => ({ isOpen: false }));
		}
	};

	const EditField = (column, value) => {
		setbankSlipPopBox(prevState => ({ ...prevState, [column]: value }));
	};

	return (
		<Modal
			i18n={i18n}
			bankSlipPopBox={bankSlipPopBox}
			handlePopBox={handlePopBox}
			EditField={EditField}
			setPopBox={setPopBox}
		/>
	);
};

export default Panel;
