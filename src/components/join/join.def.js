export const colName = [
	"UserName",
	"Password",
	// "Email",
	"Currency"
];

export const initState = {
	UserName: "",
	Password: "",
	// Email: "",
	Currency: null,
	AffiliateId: "",
	Checkbox: false
};

export const initWarningState = {
	UserName: {
		status: false,
		msg: ""
	},
	Password: {
		status: false,
		msg: ""
	},
	// Email: {
	// 	status: false,
	// 	msg: ""
	// },
	Currency: {
		status: false
	},
	AffiliateId: {
		status: false,
		msg: ""
	},
	Checkbox: {
		status: false,
		msg: ""
	}
};

export const initChecklistState = {
	UserName: false,
	Password: false,
	// Email: false,
	Checkbox: false
};
