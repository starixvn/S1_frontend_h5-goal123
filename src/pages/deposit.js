import React, { useState } from "react";
import TabPage from "../components/common/tabPage";
import path from "../path";
import BankSlip from "../components/deposit/bankSlip";
import { bankSlipPopBoxContext } from "../components/common/context";

const defTabs = {
	default: {
		to: `/${path.deposit.root}`,
		displayKey: "lbl_Deposit",
		excludeMath: path.deposit.sub.history.root
	},
	History: {
		to: path.deposit.sub.history.root,
		displayKey: "lbl_DepositHistory"
	}
};

const IndexPage = props => {
	const [bankSlipPopBox, setbankSlipPopBox] = useState({
		isOpen: false
	});

	return (
		<bankSlipPopBoxContext.Provider
			value={{ bankSlipPopBox, setbankSlipPopBox }}>
			<TabPage defTabs={defTabs}>{props.children}</TabPage>
			<BankSlip />
		</bankSlipPopBoxContext.Provider>
	);
};

export default IndexPage;
