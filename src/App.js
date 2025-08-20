import React from "react";
import Arena from "./components/Arena";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

export default function App() {
	console.log("App component rendering");
	return (
		<div className="App">
			<h1 className="main-title">Budget Talk Showdown</h1>
			<div className="debug-info">
				<p>Debug Info:</p>
				<p>React Version: {React.version}</p>
				<p>Environment: {process.env.NODE_ENV}</p>
				<p>Base URL: {process.env.PUBLIC_URL}</p>
			</div>
			<div className="main-content">
				<Arena />
				<Leaderboard />
			</div>
		</div>
	);
}
