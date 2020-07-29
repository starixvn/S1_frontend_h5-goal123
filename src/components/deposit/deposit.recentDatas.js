import React, { useContext, useState } from "react";
import { Link } from "@reach/router";
import { isConvert } from "../common/common";
import { i18nContext, userInfoContext } from "../common/context";
import { TransactionHistory } from "./deposit.history";
import ReloadSpin from "../common/reloadSpin";
import path from "../../path";

const RecentDatas = props => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const [isOpen, setOpen] = useState(false);
	const _isConvert = isConvert(userInfo.currencyId);

	const HandleOpen = () => {
		setOpen(prevState => !prevState);
	};

	let hasData = props.Datas && props.Datas.length > 0;
	let rows =
		hasData &&
		props.Datas.map(d => {
			return (
				<TransactionHistory
					key={`deposit-recent-${d.transId}`}
					{...d}
					className="info infoBlack"
					_isConvert={_isConvert}
					SubmitProof={props.SubmitProof.bind(
						this,
						d.bankInfo,
						d.depositRep,
						d.amount,
						d.transId,
						d.picFileName,
						d.refId
					)}
					ClickCancel={props.ClickCancel.bind(this, d.transId)}
				/>
			);
		});

	return (
		<>
			<div className="btn-group">
				<button className="orange switch" onClick={HandleOpen}>
					{i18n.lbl_RecentTransactions}
					<i
						className={
							"icon icon-circle-right" + (isOpen ? " open" : "")
						}></i>
				</button>
			</div>
			{hasData ? (
				<>
					<div className={`recent${isOpen ? " open" : ""}`}>
						<div className="recentTransactions">
							<div className="smallTitle">
								<i className="icon icon-history">
									{i18n.lbl_RecentTransactions}
								</i>
							</div>
							<ReloadSpin func={props.GetDepositInfoRecent} />
						</div>
						{rows}
					</div>
					{isOpen ? (
						<div className="btn-group">
							<Link
								to={path.deposit.sub.history.root}
								className="orange recentBtn">
								{i18n.lbl_AllTranscations}
							</Link>
						</div>
					) : null}
				</>
			) : isOpen ? (
				<div className="not-found">{i18n["msg_NoData"]}</div>
			) : null}
		</>
	);
};

export default RecentDatas;
