import moment from "moment";

export const promoStatus = {
	Running: 1,
	Canceled: 2,
	Expiry: 3,
	TransferOut: 5
};

export const isExpiry = ({
	periodTo,
	isLogin,
	isJoin,
	custExpiryTime,
	status,
	promotionType
}) => {
	let bonusExpiry = false;

	if (isLogin && isJoin && promotionType !== 6 && promotionType !== 7) {
		bonusExpiry =
			moment(moment.unix(custExpiryTime)).isBefore(new moment()) ||
			(status !== promoStatus.Running &&
				status !== promoStatus.TransferOut);
	}

	return moment(moment.unix(periodTo)).isBefore(new moment()) || bonusExpiry;
};

export const displayExpiryTime = ({
	i18n,
	isJoin,
	status,
	custExpiryTime,
	periodTo
}) => {
	let expiryTime = moment.duration(
		moment
			.unix(
				isJoin && status === promoStatus.Running && custExpiryTime
					? moment(custExpiryTime).unix()
					: periodTo
			)
			.diff(new Date())
	);

	let displayExpiryTime =
		expiryTime.days() +
		" " +
		i18n.lbl_Days +
		" " +
		expiryTime.hours() +
		" " +
		i18n.lbl_Hours;

	return expiryTime._milliseconds < 0 ? " - " : displayExpiryTime;
};

export const isClaimed = ({ isJoin, status }) => {
	return (
		isJoin ||
		status === promoStatus.Running ||
		status === promoStatus.TransferOut
	);
};

export const isNew = ({ periodFrom }) => {
	return moment(moment.unix(periodFrom)).isAfter(
		new moment().add(-14, "days")
	);
};
