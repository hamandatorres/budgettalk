import React, { Component } from "react";
import axios from "axios";

const API_URL =
	process.env.REACT_APP_API_URL ||
	"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com";

class Arena extends Component {
	// this.setState = ({ this.arenaCp: this.props.moveCP})
	componentDidMount() {
		this.getCp();
		console.log(this.state.cp);
	}
	getCp = () => {
		axios
			.get(`${API_URL}/api/councilperson`)
			.then((response) => {
				this.setState({ arenaCp: response.data });
			})
			.catch((error) => console.log(error));
	};

	moveCp(cp) {
		axios
			.post(`${API_URL}/api/councilperson`, { cp: cp })
			.then((response) => {
				this.setState({ arenaCp: response.data });
			})
			.catch((error) => console.log(error));
	}
	render() {
		return;
	}
}

export default Arena;
