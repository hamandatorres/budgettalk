import React from "react";
import Arena from "./components/Arena";
import Leaderboard from "./components/Leaderboard";
import NotificationSystem from "./components/NotificationSystem";
import { Provider } from "react-redux";
import { store } from "./store";
import "./App.css";

export default function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<h1>Budget Talk Showdown</h1>
				<div className="content">
					<div className="arena-section">
						<Arena />
					</div>
					<div className="leaderboard-section">
						<Leaderboard />
					</div>
				</div>
				<NotificationSystem />
			</div>
		</Provider>
	);
}
