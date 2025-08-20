import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import "./FightResult.css";

const FightResult = ({ fighter1, fighter2, onBattle }) => {
	const { winner, battleDetails } = useSelector((state) => state.battle);
	const canBattle = fighter1 && fighter2;

	return (
		<div className="fight-result">
			{(!winner || (fighter1 && fighter2)) && (
				<button
					className={`battle-button ${!canBattle ? "disabled" : ""}`}
					onClick={onBattle}
					disabled={!canBattle}
				>
					TALK!
				</button>
			)}

			{winner && battleDetails && (
				<div className="winner-display">
					<div className="winner-text">WINNER!</div>
					<div className="winner-name">{winner.name}</div>
					<div className="battle-details">
						{battleDetails.scoreDetails.map((detail, index) => (
							<div key={index} className="battle-point">
								<span className="category">{detail.category}:</span>
								<span className="point-winner">{detail.winner}</span>
							</div>
						))}
					</div>
					<div className="final-score">
						Final Score: {battleDetails.fighter1Points} -{" "}
						{battleDetails.fighter2Points}
					</div>
				</div>
			)}
		</div>
	);
};

FightResult.propTypes = {
	fighter1: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		party: PropTypes.string.isRequired,
		seniority: PropTypes.number.isRequired,
	}).isRequired,
	fighter2: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		party: PropTypes.string.isRequired,
		seniority: PropTypes.number.isRequired,
	}).isRequired,
	onBattle: PropTypes.func.isRequired,
};

export default FightResult;
