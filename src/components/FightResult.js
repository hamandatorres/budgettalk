import React from "react";
import "./FightResult.css";

const FightResult = ({ fighter1, fighter2, onBattle, winner }) => {
	const canBattle = fighter1 && fighter2;

	return (
		<div className="fight-result">
			{!winner && (
				<button
					className={`battle-button ${!canBattle ? "disabled" : ""}`}
					onClick={onBattle}
					disabled={!canBattle}
				>
					TALK!
				</button>
			)}

			{winner && (
				<div className="winner-display">
					<div className="winner-text">WINNER!</div>
					<div className="winner-name">{winner.name}</div>
					<div className="winner-stats">
						<p>Years of Service: {winner.seniority}</p>
						<p>Wins: {winner.wins || 0}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default FightResult;
