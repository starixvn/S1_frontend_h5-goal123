import React, { useEffect, useState } from "react";
import { api_WhoAMI } from "../service/api/site";

const IndexPage = () => {
	const [datas, setDatas] = useState(null);
	useEffect(() => {
		let mounted = true;
		api_WhoAMI().then(res => {
			if (mounted) {
				setDatas(res.data.data);
			}
		});
		return () => {
			mounted = false;
		};
	}, []);

	let row =
		datas &&
		Object.keys(datas).map(key => {
			return (
				<p>
					{key}: {datas[key]}
				</p>
			);
		});
	return <div className="info">{row}</div>;
};

export default IndexPage;
