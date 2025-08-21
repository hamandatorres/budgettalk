import { createSelector } from "@reduxjs/toolkit";

// Council Person Selectors
export const selectCouncilPersons = (state) => state.councilPerson.list;
export const selectCouncilLoading = (state) => state.councilPerson.loading;
export const selectCouncilError = (state) => state.councilPerson.error;
export const selectCreateLoading = (state) => state.councilPerson.createLoading;
export const selectUpdateLoading = (state) => state.councilPerson.updateLoading;
export const selectDeleteLoading = (state) => state.councilPerson.deleteLoading;

// Memoized selectors for better performance
export const selectCouncilPersonsByParty = createSelector(
	[selectCouncilPersons],
	(councilPersons) => {
		return councilPersons.reduce((groups, person) => {
			const party = person.party || "Independent";
			if (!groups[party]) {
				groups[party] = [];
			}
			groups[party].push(person);
			return groups;
		}, {});
	}
);

export const selectSortedCouncilPersonsByWins = createSelector(
	[selectCouncilPersons],
	(councilPersons) => {
		return [...councilPersons].sort((a, b) => (b.wins || 0) - (a.wins || 0));
	}
);

export const selectCouncilPersonById = createSelector(
	[selectCouncilPersons, (state, id) => id],
	(councilPersons, id) => {
		return councilPersons.find((person) => person.id === id);
	}
);

export const selectPartyMemberCount = createSelector(
	[selectCouncilPersonsByParty],
	(partyGroups) => {
		return Object.entries(partyGroups).reduce((counts, [party, members]) => {
			counts[party] = members.length;
			return counts;
		}, {});
	}
);

// Battle Selectors
export const selectBattleState = (state) => state.battle;
export const selectSelectedFighter1 = (state) => state.battle.selectedFighter1;
export const selectSelectedFighter2 = (state) => state.battle.selectedFighter2;
export const selectBattleWinner = (state) => state.battle.winner;
export const selectBattleDetails = (state) => state.battle.battleDetails;
export const selectBattleHistory = (state) => state.battle.battleHistory;
export const selectIsBattleInProgress = (state) => state.battle.isInProgress;

export const selectCanBattle = createSelector(
	[selectSelectedFighter1, selectSelectedFighter2, selectIsBattleInProgress],
	(fighter1, fighter2, inProgress) => {
		return fighter1 && fighter2 && !inProgress;
	}
);

// UI Selectors
export const selectIsModalOpen = (state) => state.ui.isModalOpen;
export const selectExpandedParty = (state) => state.ui.expandedParty;

// Selection Selectors
export const selectSelectedMemberId = (state) =>
	state.selection.selectedMemberId;

// Notification Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadNotifications = createSelector(
	[selectNotifications],
	(notifications) => {
		return notifications.filter((notification) => !notification.read);
	}
);

// Complex selectors
export const selectBattleStatistics = createSelector(
	[selectBattleHistory],
	(battleHistory) => {
		const stats = {
			totalBattles: battleHistory.length,
			winsByMember: {},
			winsByParty: {},
			averageBattleDuration: 0,
		};

		battleHistory.forEach((battle) => {
			// Count wins by member
			const winnerId = battle.winner.id;
			stats.winsByMember[winnerId] = (stats.winsByMember[winnerId] || 0) + 1;

			// Count wins by party
			const winnerParty = battle.winner.party;
			stats.winsByParty[winnerParty] =
				(stats.winsByParty[winnerParty] || 0) + 1;
		});

		return stats;
	}
);

export const selectTopPerformers = createSelector(
	[selectSortedCouncilPersonsByWins],
	(sortedMembers) => {
		return sortedMembers.slice(0, 5); // Top 5 performers
	}
);
