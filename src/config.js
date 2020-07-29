const siteName = "Goal123";

export default process.env.NODE_ENV === "production"
	? {
			siteName,
			apiURL: "",
			openURL: "",
			imgUrl: "",
			t_and_cURL: ""
	  }
	: {
			siteName,
			appURL: "http://localhost:3000",
			// apiURL: "http://localhost:60930",
			// imgUrl: "http://localhost:60930",
			// t_and_cURL: "http://localhost:60930",
			apiURL: "http://m.n88dev.com",
			imgUrl: "http://m.n88dev.com",
			t_and_cURL: "http://m.n88dev.com",
			openURL: "http://m.n88dev.com"
	  };
