import React, { Component } from "react";
import axios from "axios";
import FightResult from "./FightResult";
import "./Arena.css";

const API_URL =
	process.env.REACT_APP_API_URL ||
	"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com";

class Arena extends Component {
	state = {
		councilPersons: [],
		selectedPerson1: null,
		selectedPerson2: null,
		winner: null,
	};

	componentDidMount() {
		this.getCouncilPersons();
	}

	getCouncilPersons = () => {
		console.log(
			"Fetching council persons from:",
			`${API_URL}/api/councilperson`
		);
		axios
			.get(`${API_URL}/api/councilperson`)
			.then((response) => {
				console.log("Received data:", response.data);
				this.setState({ councilPersons: response.data });
			})
			.catch((error) => {
				console.error("Error fetching council persons:", error);
			});
	};

	handleDragStart = (e, person) => {
		e.dataTransfer.setData("person", JSON.stringify(person));
		e.currentTarget.classList.add("dragging");
	};

	handleDragEnd = (e) => {
		e.currentTarget.classList.remove("dragging");
	};

	handleDragOver = (e) => {
		e.preventDefault();
		e.currentTarget.classList.add("drag-over");
	};

	handleDragLeave = (e) => {
		e.currentTarget.classList.remove("drag-over");
	};

	handleDrop = (e, position) => {
		e.preventDefault();
		e.currentTarget.classList.remove("drag-over");
		const person = JSON.parse(e.dataTransfer.getData("person"));
		const { selectedPerson1, selectedPerson2 } = this.state;

		// Prevent same person in both slots
		if (position === "fighter1" && selectedPerson2?.id !== person.id) {
			this.setState({ selectedPerson1: person });
		} else if (position === "fighter2" && selectedPerson1?.id !== person.id) {
			this.setState({ selectedPerson2: person });
		}
	};

	removeFighter = (position) => {
		if (position === "fighter1") {
			this.setState({ selectedPerson1: null, winner: null });
		} else {
			this.setState({ selectedPerson2: null, winner: null });
		}
	};

	handleBattle = () => {
		const { selectedPerson1, selectedPerson2 } = this.state;
		if (!selectedPerson1 || !selectedPerson2) return;

		// Compare years of service
		const winner =
			selectedPerson1.seniority > selectedPerson2.seniority
				? selectedPerson1
				: selectedPerson2;

		this.setState({ winner });
	};

	render() {
		const { councilPersons, selectedPerson1, selectedPerson2 } = this.state;
		console.log("Current state:", this.state);

		return (
			<div className="arena-container">
				<div className="roster">
					<h2>Council Members</h2>
					{councilPersons.length === 0 ? (
						<div>
							<p>Loading council members...</p>
							<p>API URL: {API_URL}</p>
						</div>
					) : (
						<div className="council-list">
							{councilPersons.map((person) => (
								<div
									key={person.id}
									className={`council-person ${
										selectedPerson1?.id === person.id ||
										selectedPerson2?.id === person.id
											? "selected"
											: ""
									}`}
									draggable="true"
									onDragStart={(e) => this.handleDragStart(e, person)}
									onDragEnd={this.handleDragEnd}
								>
									<h3>{person.name}</h3>
									<p>Party: {person.party}</p>
									<p>Years: {person.seniority}</p>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="battle-arena">
					<h2>Budget Arena</h2>
					<div className="versus-container">
						<div className="challenger">
							<div
								className={`arena-fighter ${!selectedPerson1 ? "empty" : ""}`}
								onDragOver={this.handleDragOver}
								onDragLeave={this.handleDragLeave}
								onDrop={(e) => this.handleDrop(e, "fighter1")}
								onClick={() =>
									selectedPerson1 && this.removeFighter("fighter1")
								}
							>
								{selectedPerson1 ? (
									<>
										<h3>{selectedPerson1.name}</h3>
										<p>Party: {selectedPerson1.party}</p>
										<p>Years: {selectedPerson1.seniority}</p>
									</>
								) : (
									<h3>Drag Member Here</h3>
								)}
							</div>
						</div>

						<div className="versus">VS</div>

						<div className="challenger">
							<div
								className={`arena-fighter ${!selectedPerson2 ? "empty" : ""}`}
								onDragOver={this.handleDragOver}
								onDragLeave={this.handleDragLeave}
								onDrop={(e) => this.handleDrop(e, "fighter2")}
								onClick={() =>
									selectedPerson2 && this.removeFighter("fighter2")
								}
							>
								{selectedPerson2 ? (
									<>
										<h3>{selectedPerson2.name}</h3>
										<p>Party: {selectedPerson2.party}</p>
										<p>Years: {selectedPerson2.seniority}</p>
									</>
								) : (
									<h3>Drag Member Here</h3>
								)}
							</div>
						</div>
					</div>
					<FightResult
						fighter1={selectedPerson1}
						fighter2={selectedPerson2}
						onBattle={this.handleBattle}
						winner={this.state.winner}
					/>
				</div>
			</div>
		);
	}
}

export default Arena;
