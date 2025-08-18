import React, { Component } from "react";
import axios from "axios";

const API_URL =
	process.env.REACT_APP_API_URL ||
	"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com";

class Arena extends Component {
	state = {
		councilPersons: [],
		selectedPerson: null,
	};

	componentDidMount() {
		this.getCouncilPersons();
	}

	getCouncilPersons = () => {
		axios
			.get(`${API_URL}/api/councilperson`)
			.then((response) => {
				this.setState({ councilPersons: response.data });
			})
			.catch((error) => console.log(error));
	};

	selectPerson = (person) => {
		this.setState({ selectedPerson: person });
	};

	render() {
		const { councilPersons, selectedPerson } = this.state;

		return (
			<div className="arena">
				<h2>Council Members</h2>
				<div className="council-list">
					{councilPersons.map((person) => (
						<div
							key={person.id}
							className={`council-person ${
								selectedPerson?.id === person.id ? "selected" : ""
							}`}
							onClick={() => this.selectPerson(person)}
						>
							<h3>{person.name}</h3>
							<p>Party: {person.party}</p>
							<p>Years of Service: {person.seniority}</p>
						</div>
					))}
				</div>

				{selectedPerson && (
					<div className="selected-person">
						<h3>Selected Council Person</h3>
						<h4>{selectedPerson.name}</h4>
						<p>Party: {selectedPerson.party}</p>
						<p>Years of Service: {selectedPerson.seniority}</p>
					</div>
				)}
			</div>
		);
	}
}

export default Arena;
