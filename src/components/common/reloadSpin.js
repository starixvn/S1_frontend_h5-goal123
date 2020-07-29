import React, { useState, useRef, useEffect } from "react";

export default props => {
	const [spin, setSpin] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const clickSpin = () => {
		setSpin(true);
		if (!spin) {
			props.func();
		}
		setTimeout(() => {
			if (isMountedRef.current) {
				setSpin(false);
			}
		}, 1500);
	};

	return (
		<button
			className={`icon icon-spinner11 clickBtn${spin ? " open" : ""}`}
			onClick={clickSpin}></button>
	);
};
