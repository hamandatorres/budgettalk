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
		expandedParty: null,
		battleDetails: null,
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

	calculateBattlePoints = (fighter1, fighter2) => {
		let points1 = 0;
		let points2 = 0;
		let scoreDetails = [];

		// Points for years of service
		if (fighter1.seniority > fighter2.seniority) {
			points1++;
			scoreDetails.push({
				category: "Years of Service",
				winner: fighter1.name,
			});
		} else if (fighter2.seniority > fighter1.seniority) {
			points2++;
			scoreDetails.push({
				category: "Years of Service",
				winner: fighter2.name,
			});
		}

		// Points for wins
		const wins1 = fighter1.wins || 0;
		const wins2 = fighter2.wins || 0;
		if (wins1 > wins2) {
			points1++;
			scoreDetails.push({ category: "Experience", winner: fighter1.name });
		} else if (wins2 > wins1) {
			points2++;
			scoreDetails.push({ category: "Experience", winner: fighter2.name });
		}

		// Random point
		const randomPoint = Math.random() < 0.5;
		if (randomPoint) {
			points1++;
			scoreDetails.push({ category: "Random Factor", winner: fighter1.name });
		} else {
			points2++;
			scoreDetails.push({ category: "Random Factor", winner: fighter2.name });
		}

		return {
			fighter1Points: points1,
			fighter2Points: points2,
			winner: points1 > points2 ? fighter1 : fighter2,
			scoreDetails,
		};
	};

	handleBattle = async () => {
		const { selectedPerson1, selectedPerson2 } = this.state;
		if (!selectedPerson1 || !selectedPerson2) return;

		try {
			// Calculate battle points and determine winner
			const battleResult = this.calculateBattlePoints(
				selectedPerson1,
				selectedPerson2
			);
			const winner = battleResult.winner;
			const loser =
				winner.id === selectedPerson1.id ? selectedPerson2 : selectedPerson1;

			// Update winner's wins count
			const updatedWinner = {
				...winner,
				wins: (winner.wins || 0) + 1,
			};

			// Update winner in database
			await axios.put(
				`${API_URL}/api/councilperson/${winner.id}`,
				updatedWinner
			);

			// Delete loser and get replacement
			const response = await axios.delete(
				`${API_URL}/api/councilperson/${loser.id}`
			);
			const { replacement } = response.data;

			// Update local state
			this.setState((prevState) => ({
				winner: updatedWinner,
				battleDetails: battleResult,
				councilPersons: prevState.councilPersons.map((person) => {
					if (person.id === winner.id) return updatedWinner;
					if (person.id === loser.id) return replacement;
					return person;
				}),
				selectedPerson1:
					winner.id === selectedPerson1.id ? updatedWinner : null,
				selectedPerson2:
					winner.id === selectedPerson2.id ? updatedWinner : null,
			}));
		} catch (error) {
			console.error("Error handling battle:", error);
		}
	};

	groupByParty = (councilPersons) => {
		return councilPersons.reduce((groups, person) => {
			if (!groups[person.party]) {
				groups[person.party] = [];
			}
			groups[person.party].push(person);
			return groups;
		}, {});
	};

	toggleParty = (party) => {
		this.setState((prevState) => ({
			expandedParty: prevState.expandedParty === party ? null : party,
		}));
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
						<div className="party-groups">
							{Object.entries(this.groupByParty(councilPersons)).map(
								([party, members]) => (
									<div key={party} className="party-group">
										<button
											className={`party-button ${
												this.state.expandedParty === party ? "expanded" : ""
											}`}
											onClick={() => this.toggleParty(party)}
										>
											{party} Party ({members.length})
										</button>
										<div
											className={`council-list ${
												this.state.expandedParty === party ? "expanded" : ""
											}`}
										>
											{members.map((person) => (
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
													<p>Years: {person.seniority}</p>
													<p>Wins: {person.wins || 0}</p>
												</div>
											))}
										</div>
									</div>
								)
							)}
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
										<p>Wins: {selectedPerson1.wins || 0}</p>
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
										<p>Wins: {selectedPerson2.wins || 0}</p>
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
						battleDetails={this.state.battleDetails}
					/>
				</div>
			</div>
		);
	}
}

export default Arena;
