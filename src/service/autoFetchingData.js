//import useInterval from "../components/hook/useInterval";
import { useEffect, useRef } from "react";

// export default (
// 	Func_GetData,
// 	filterData,
// 	pageInfo,
// 	State_SetData,
// 	State_SetPageInfo,
// 	State_SetPopBox,
// 	processing,
// 	State_SetProcessing
// ) => {
// 	const isMountedRef = useRef(null);

// 	useEffect(() => {
// 		isMountedRef.current = true;
// 		return () => (isMountedRef.current = false);
// 	});

// 	useInterval(
// 		() => {
// 			let pageNumber = pageInfo.pageNumber + 1;
// 			if (!processing) {
// 				State_SetProcessing(true);
// 				Func_GetData({
// 					...filterData,
// 					PageNumber: pageNumber
// 				}).then(
// 					res => {
// 						if (isMountedRef.current) {
// 							if (res.data.errorCode === 0) {
// 								State_SetData(prevState => {
// 									return pageNumber === 1
// 										? res.data.data
// 										: [...prevState, ...res.data.data];
// 								});
// 								if (
// 									res.data.totalPages >= res.data.pageNumber
// 								) {
// 									State_SetPageInfo(prevState => {
// 										return {
// 											totalPages: res.data.totalPages,
// 											pageNumber: res.data.pageNumber
// 										};
// 									});
// 								}
// 							} else {
// 								State_SetPopBox({
// 									isOpen: true,
// 									content: res.data.message
// 								});
// 							}

// 							State_SetProcessing(false);
// 						}
// 					},
// 					err => {
// 						if (isMountedRef.current) {
// 							State_SetProcessing(false);
// 						}
// 					}
// 				);
// 			}
// 		},
// 		pageInfo.pageNumber === pageInfo.totalPages ? null : 2000
// 	);
// };

export default (
	Func_GetData,
	filterData,
	pageInfo,
	State_SetData,
	State_SetPageInfo,
	State_SetPopBox,
	processing,
	State_SetProcessing,
	clickSubmit
) => {
	const isMountedRef = useRef(null);
	const trigger = useRef(null);
	const _filterData = useRef();
	const _pageInfo = useRef();
	const _clickSubmit = useRef();
	const _processing = useRef();

	useEffect(() => {
		_filterData.current = filterData;
		_pageInfo.current = pageInfo;
		_clickSubmit.current = clickSubmit;
		_processing.current = processing;
	});

	useEffect(() => {
		const ScrollBarListener = () => {
			if (_clickSubmit.current) {
				let window_height =
					window.innerHeight ||
					document.documentElement.clientHeight ||
					document.body.clientHeight;

				let window_scrollTop =
					window.pageYOffset ||
					document.documentElement.scrollTop ||
					document.body.scrollTop;

				let body = document.body;
				let html = document.documentElement;

				let document_height =
					Math.max(
						body.scrollHeight,
						body.offsetHeight,
						html.clientHeight,
						html.scrollHeight,
						html.offsetHeight
					) * 0.8;

				if (
					!trigger.current &&
					window_height + window_scrollTop >= document_height
				) {
					trigger.current = true;
					let pageNumber = _pageInfo.current.pageNumber + 1;

					if (
						!_processing.current &&
						pageNumber <= _pageInfo.current.totalPages
					) {
						State_SetProcessing(true);
						Func_GetData({
							..._filterData.current,
							PageNumber: pageNumber
						}).then(
							res => {
								if (isMountedRef.current) {
									if (res.data.errorCode === 0) {
										State_SetData(prevState => {
											return pageNumber === 1
												? res.data.data
												: [
														...prevState,
														...res.data.data
												  ];
										});
										if (
											res.data.totalPages >=
											res.data.pageNumber
										) {
											State_SetPageInfo(prevState => {
												return {
													totalPages:
														res.data.totalPages,
													pageNumber:
														res.data.pageNumber
												};
											});
										}
									} else {
										State_SetPopBox({
											isOpen: true,
											content: res.data.message
										});
									}

									State_SetProcessing(false);
									trigger.current = false;
								}
							},
							err => {
								if (isMountedRef.current) {
									State_SetProcessing(false);
									trigger.current = false;
								}
							}
						);
					} else {
						trigger.current = false;
					}
				}
			}
		};

		isMountedRef.current = true;
		window.addEventListener("mousewheel", ScrollBarListener, false);
		window.addEventListener("touchmove", ScrollBarListener, {
			passive: false
		});

		return () => {
			isMountedRef.current = false;
			window.removeEventListener("mousewheel", ScrollBarListener);
			window.removeEventListener("touchmove", ScrollBarListener, {
				passive: false
			});
		};
	});
};
