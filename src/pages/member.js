import React from "react";
import TabPage from "../components/common/tabPage";
import path from "../path";

const defTabs = {
	default: {
		to: `/${path.member.root}`,
		displayKey: "lbl_Profile",
		excludeMath: path.member.sub.bankInfo.root
	},
	bankInfo: {
		to: path.member.sub.bankInfo.root,
		displayKey: "lbl_BankInfo"
	}
};

const IndexPage = props => {
	return <TabPage defTabs={defTabs}>{props.children}</TabPage>;
};

export default IndexPage;
