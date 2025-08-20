import React from "react";
import { useSelector } from "react-redux";
import "./Leaderboard.css";

const Leaderboard = () => {
	const councilPersons = useSelector((state) => state.councilPerson.list);

	// Sort council persons by wins (descending)
	const sortedMembers = [...councilPersons].sort(
		(a, b) => (b.wins || 0) - (a.wins || 0)
	);

	return (
		<div className="leaderboard">
			<h2>Council Leaderboard</h2>
			<div className="leaderboard-list">
				{sortedMembers.map((member) => (
					<div key={member.id} className="leaderboard-item">
						<div className="member-info">
							<span className="member-name">{member.name}</span>
							<span
								className="member-party"
								style={{ color: member.party.toLowerCase() }}
							>
								{member.party}
							</span>
						</div>
						<div className="member-stats">
							<span className="wins-count">Wins: {member.wins || 0}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Leaderboard;
