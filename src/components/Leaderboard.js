import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedMember } from "../store/slices/selectionSlice";
import "./Leaderboard.css";

const Leaderboard = () => {
	const dispatch = useDispatch();
	const councilPersons = useSelector((state) => state.councilPerson.list);
	const selectedMemberId = useSelector(
		(state) => state.selection.selectedMemberId
	);

	// Sort council persons by wins (descending)
	const sortedMembers = [...councilPersons].sort(
		(a, b) => (b.wins || 0) - (a.wins || 0)
	);

	const handleMemberClick = (memberId) => {
		dispatch(
			setSelectedMember(memberId === selectedMemberId ? null : memberId)
		);
	};

	return (
		<div className="leaderboard">
			<h2>Council Leaderboard</h2>
			<div className="leaderboard-list">
				{sortedMembers.map((member) => (
					<div
						key={member.id}
						className={`leaderboard-item ${
							member.id === selectedMemberId ? "selected" : ""
						}`}
						onClick={() => handleMemberClick(member.id)}
					>
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
