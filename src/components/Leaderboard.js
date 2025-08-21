import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedMember } from "../store/slices/selectionSlice";
import {
	selectSortedCouncilPersonsByWins,
	selectSelectedMemberId,
} from "../store/selectors";
import "./Leaderboard.css";

const Leaderboard = () => {
	const dispatch = useDispatch();
	const sortedMembers = useSelector(selectSortedCouncilPersonsByWins);
	const selectedMemberId = useSelector(selectSelectedMemberId);

	const handleMemberClick = (memberId) => {
		dispatch(
			setSelectedMember(memberId === selectedMemberId ? null : memberId)
		);
	};

	return (
		<div className="leaderboard">
			<h2>Leaderboard</h2>
			{sortedMembers.length === 0 ? (
				<div className="no-members">No council members yet</div>
			) : (
				<table className="leaderboard-table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Party</th>
							<th>Wins</th>
						</tr>
					</thead>
					<tbody>
						{sortedMembers.map((member, index) => (
							<tr
								key={member.id}
								onClick={() => handleMemberClick(member.id)}
								style={{
									cursor: "pointer",
									backgroundColor:
										member.id === selectedMemberId ? "#f0f0f0" : "transparent",
								}}
							>
								<td className="rank">{index + 1}</td>
								<td>{member.name}</td>
								<td>{member.party}</td>
								<td>{member.wins || 0}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Leaderboard;
