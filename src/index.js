import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import "./index.css";

// Error boundary component
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("React Error Boundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: "20px", textAlign: "center" }}>
					<h1>Something went wrong.</h1>
					<pre style={{ textAlign: "left" }}>
						{this.state.error?.toString()}
					</pre>
				</div>
			);
		}
		return this.props.children;
	}
}

console.log("Starting application initialization...");
const container = document.getElementById("root");
console.log("Root container found:", container);

try {
	const root = createRoot(container);
	console.log("React root created successfully");

	root.render(
		<React.StrictMode>
			<ErrorBoundary>
				<Provider store={store}>
					<App />
				</Provider>
			</ErrorBoundary>
		</React.StrictMode>
	);
	console.log("Initial render completed");
} catch (error) {
	console.error("Error during application initialization:", error);
}
