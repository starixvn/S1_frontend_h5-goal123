import React from "react";
import TabPage from "../components/common/tabPage";
import path from "../path";

const defTabs = {
	default: {
		to: `/${path.message.root}`,
		displayKey: "lbl_PersonalMsg",
		excludeMath: path.message.sub.announcement.root
	},
	History: {
		to: path.message.sub.announcement.root,
		displayKey: "lbl_Announcement"
	}
};

const IndexPage = props => {
	return <TabPage defTabs={defTabs}>{props.children}</TabPage>;
};

export default IndexPage;
