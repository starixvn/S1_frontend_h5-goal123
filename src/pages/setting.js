import React from "react";
import TabPage from "../components/common/tabPage";
import path from "../path";

const defTabs = {
	default: {
		to: `/${path.setting.root}`,
		displayKey: "lbl_Setting",
		excludeMath: path.setting.sub.other.root
	},
	other: {
		to: path.setting.sub.other.root,
		displayKey: "lbl_Other"
	}
};

const IndexPage = props => {
	return (
		<TabPage defTabs={defTabs} beforeLogin={true}>
			{props.children}
		</TabPage>
	);
};

export default IndexPage;
