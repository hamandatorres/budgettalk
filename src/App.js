import React from "react";
import Arena from "./components/Arena";
import "./App.css";

export default function App() {
	console.log("App component rendering");
	return (
		<div className="App">
			<h1 className="main-title">Budget Talk Showdown</h1>
			<div
				style={{ padding: "20px", backgroundColor: "#f0f0f0", margin: "20px" }}
			>
				<p>Debug Info:</p>
				<p>React Version: {React.version}</p>
				<p>Environment: {process.env.NODE_ENV}</p>
				<p>Base URL: {process.env.PUBLIC_URL}</p>
			</div>
			<Arena />
		</div>
	);
}
