import React, { useContext, useRef, useEffect, useState } from "react";
import {
	i18nContext,
	userInfoContext,
	walletInfoContext,
	popBoxContext
} from "../common/context";
import { number_format, isConvert } from "../common/common";
import {
	api_GetWalletInfo,
	api_account_GetCustBonusWallet
} from "../../service/api/account";
import ReloadSpin from "../common/reloadSpin";
import BonusWallet from "./profile.wallet.bonus";

export default () => {
	const { i18n } = useContext(i18nContext);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { walletInfo, setWalletInfo } = useContext(walletInfoContext);
	const isMountedRef = useRef(null);
	const [tpWallet, setTpWallet] = useState([]);
	const [bonusWallet, setBonusWallet] = useState({});

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetBalance();
	}, []);

	const GetBalance = () => {
		api_GetWalletInfo().then(
			res => {
				if (res.data.errorCode === 0) {
					let data = res.data.data;
					if (data !== null) {
						if (isMountedRef.current) {
							setWalletInfo(prevState => ({
								...prevState,
								main: data.balance
							}));

							if (data.tpWallets.length > 0) {
								let tpWalletsArr = data.tpWallets.map(t => {
									let balance = t.balance;
									return {
										tpId: t.tpId,
										displayKey: t.displayKey,
										balance: balance
									};
								});

								setTpWallet(tpWalletsArr);
							}
						}
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						title: i18n.lbl_ImportantNote,
						content: i18n.msg_ApiServerError
					});
				}
			}
		);

		api_account_GetCustBonusWallet().then(res => {
			if (res.data.errorCode === 0 && isMountedRef.current) {
				let result = {};
				res.data.data.forEach(b => {
					if (result.tpId) {
						result[b.tpId].push({
							...b
						});
					} else {
						result[b.tpId] = [{ ...b }];
					}
				});
				setBonusWallet(result);
			}
		});
	};

	let _tpWallets = tpWallet.map(t => {
		return (
			<Wallet
				key={`profile-tpWallet-${t.tpId}`}
				i18n={i18n}
				titleKey={`lbl_TpWallet_${t.tpId}`}
				currencyId={userInfo.currencyId}
				balance={t.balance}
				func_GetBalance={GetBalance}
				bonusWallet={bonusWallet[t.tpId]}
			/>
		);
	});

	return (
		<>
			<Wallet
				i18n={i18n}
				titleKey={"lbl_MainWallet"}
				currencyId={userInfo.currencyId}
				balance={walletInfo.main}
				func_GetBalance={GetBalance}
				bonusWallet={bonusWallet[0]}
			/>
			{_tpWallets}
		</>
	);
};

const Wallet = ({
	i18n,
	currencyId,
	titleKey,
	balance,
	func_GetBalance,
	bonusWallet
}) => {
	let _bonusWallet =
		bonusWallet &&
		bonusWallet
			.filter(b => b.status === 0 || b.status === 1)
			.map(b => {
				return (
					<BonusWallet
						key={`profile-wallet-${titleKey}-${b.promoCategoryId}`}
						i18n={i18n}
						currencyId={currencyId}
						{...b}
					/>
				);
			});

	return (
		<div className="account">
			<div className="info">
				<span className="title">{i18n[titleKey]}</span>
				<div>
					<span className="text-org">
						{i18n[`Currency_${currencyId}`]}
						{i18n["lbl_Cash"]}
					</span>{" "}
					{number_format(balance, isConvert(currencyId))}
				</div>
			</div>
			<ReloadSpin func={func_GetBalance} />
			{_bonusWallet}
		</div>
	);
};
