import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCouncilPersons } from "../store/slices/councilPersonSlice";
import { toggleModal } from "../store/slices/uiSlice";
import { setBattleResult } from "../store/slices/battleSlice";
import AddCouncilPersonModal from "./AddCouncilPersonModal";
import FightResult from "./FightResult";
import "./Arena.css";

const Arena = () => {
	const dispatch = useDispatch();
	const { list, loading, error } = useSelector((state) => state.councilPerson);
	const [expandedParty, setExpandedParty] = useState(null);
	const [selectedFighter1, setSelectedFighter1] = useState(null);
	const [selectedFighter2, setSelectedFighter2] = useState(null);

	useEffect(() => {
		dispatch(fetchCouncilPersons());
	}, [dispatch]);

	if (loading) {
		return <div className="arena-container">Loading...</div>;
	}

	if (error) {
		return <div className="arena-container">Error: {error}</div>;
	}

	const partyGroups = list.reduce((groups, person) => {
		const party = person.party || "Independent";
		if (!groups[party]) {
			groups[party] = [];
		}
		groups[party].push(person);
		return groups;
	}, {});

	const handlePartyClick = (party) => {
		setExpandedParty(expandedParty === party ? null : party);
	};

	const handleFighterSelect = (person) => {
		if (!selectedFighter1) {
			setSelectedFighter1(person);
		} else if (!selectedFighter2 && person.id !== selectedFighter1.id) {
			setSelectedFighter2(person);
		}
	};

	const handleFighterRemove = (position) => {
		if (position === 1) {
			setSelectedFighter1(null);
		} else {
			setSelectedFighter2(null);
		}
	};

	return (
		<div className="arena-container">
			<div className="roster">
				<div className="roster-header">
					<h2>Council Roster</h2>
					<button
						className="add-button"
						onClick={() => dispatch(toggleModal())}
					>
						Add Council Person
					</button>
				</div>
				<div className="party-groups">
					{Object.entries(partyGroups).map(([party, members]) => (
						<div key={party} className="party-group">
							<button
								className={`party-button ${
									expandedParty === party ? "expanded" : ""
								}`}
								onClick={() => handlePartyClick(party)}
							>
								{party} ({members.length})
							</button>
							<div
								className={`council-list ${
									expandedParty === party ? "expanded" : ""
								}`}
							>
								{members.map((person) => (
									<div
										key={person.id}
										className={`council-person ${
											selectedFighter1?.id === person.id ||
											selectedFighter2?.id === person.id
												? "selected"
												: ""
										}`}
										onClick={() => handleFighterSelect(person)}
									>
										<h3>{person.name}</h3>
										<p>Seniority: {person.seniority}</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="battle-arena">
				<h2>Battle Arena</h2>
				<div className="versus-container">
					<div className="challenger">
						<div
							className={`arena-fighter ${!selectedFighter1 ? "empty" : ""}`}
							onClick={() => selectedFighter1 && handleFighterRemove(1)}
						>
							{selectedFighter1 ? (
								<>
									<h3>{selectedFighter1.name}</h3>
									<p>{selectedFighter1.party}</p>
									<p>Seniority: {selectedFighter1.seniority}</p>
								</>
							) : (
								<p>Select Fighter 1</p>
							)}
						</div>
					</div>
					<div className="versus">VS</div>
					<div className="challenger">
						<div
							className={`arena-fighter ${!selectedFighter2 ? "empty" : ""}`}
							onClick={() => selectedFighter2 && handleFighterRemove(2)}
						>
							{selectedFighter2 ? (
								<>
									<h3>{selectedFighter2.name}</h3>
									<p>{selectedFighter2.party}</p>
									<p>Seniority: {selectedFighter2.seniority}</p>
								</>
							) : (
								<p>Select Fighter 2</p>
							)}
						</div>
					</div>
				</div>
				{selectedFighter1 && selectedFighter2 && (
					<FightResult
						fighter1={selectedFighter1}
						fighter2={selectedFighter2}
						onBattle={() => {
							const result = determineBattleWinner(
								selectedFighter1,
								selectedFighter2
							);
							dispatch(setBattleResult(result));
						}}
					/>
				)}
			</div>
			<AddCouncilPersonModal />
		</div>
	);
};

const determineBattleWinner = (fighter1, fighter2) => {
	// Initialize scores
	let fighter1Points = 0;
	let fighter2Points = 0;
	const scoreDetails = [];

	// Compare seniority
	if (fighter1.seniority > fighter2.seniority) {
		fighter1Points++;
		scoreDetails.push({
			category: "Seniority",
			winner: fighter1.name,
		});
	} else if (fighter2.seniority > fighter1.seniority) {
		fighter2Points++;
		scoreDetails.push({
			category: "Seniority",
			winner: fighter2.name,
		});
	}

	// Party influence calculation
	const partyInfluence = {
		Progressive: 3,
		Conservative: 3,
		Moderate: 2,
		Independent: 1,
		Green: 2,
	};

	const fighter1Influence = partyInfluence[fighter1.party] || 1;
	const fighter2Influence = partyInfluence[fighter2.party] || 1;

	if (fighter1Influence > fighter2Influence) {
		fighter1Points++;
		scoreDetails.push({
			category: "Party Influence",
			winner: fighter1.name,
		});
	} else if (fighter2Influence > fighter1Influence) {
		fighter2Points++;
		scoreDetails.push({
			category: "Party Influence",
			winner: fighter2.name,
		});
	}

	// Random factor for debate performance (1-10)
	const fighter1Debate = Math.floor(Math.random() * 10) + 1;
	const fighter2Debate = Math.floor(Math.random() * 10) + 1;

	if (fighter1Debate > fighter2Debate) {
		fighter1Points++;
		scoreDetails.push({
			category: "Debate Performance",
			winner: fighter1.name,
		});
	} else if (fighter2Debate > fighter1Debate) {
		fighter2Points++;
		scoreDetails.push({
			category: "Debate Performance",
			winner: fighter2.name,
		});
	}

	// Determine winner
	const winner = fighter1Points > fighter2Points ? fighter1 : fighter2;

	return {
		winner,
		details: {
			fighter1Points,
			fighter2Points,
			scoreDetails,
		},
	};
};

export default Arena;
