import React from "react";
import App from "./app";
//import * as serviceWorker from "./serviceWorker";
import { render } from "react-snapshot";
import "./styles/css/style-dark.css";
import "./styles/css/style.css";
import "./styles/css/font.css";
import "./styles/css/swiper.css";

const Content = () => {
	return (
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
};

render(<Content />, document.getElementById("root"));

//serviceWorker.register();
