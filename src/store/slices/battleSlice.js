import { createSlice } from "@reduxjs/toolkit";

const battleSlice = createSlice({
	name: "battle",
	initialState: {
		selectedFighter1: null,
		selectedFighter2: null,
		winner: null,
		battleDetails: null,
		battleHistory: [],
		isInProgress: false,
		maxHistorySize: 50,
	},
	reducers: {
		setFighter: (state, action) => {
			const { position, fighter } = action.payload;
			if (position === "fighter1") {
				state.selectedFighter1 = fighter;
			} else {
				state.selectedFighter2 = fighter;
			}
			// Clear previous battle results when changing fighters
			if (state.winner || state.battleDetails) {
				state.winner = null;
				state.battleDetails = null;
			}
		},
		removeFighter: (state, action) => {
			const position = action.payload;
			if (position === "fighter1") {
				state.selectedFighter1 = null;
			} else {
				state.selectedFighter2 = null;
			}
			state.winner = null;
			state.battleDetails = null;
		},
		clearBattle: (state) => {
			state.selectedFighter1 = null;
			state.selectedFighter2 = null;
			state.winner = null;
			state.battleDetails = null;
			state.isInProgress = false;
		},
		startBattle: (state) => {
			state.isInProgress = true;
			state.winner = null;
			state.battleDetails = null;
		},
		setBattleResult: (state, action) => {
			const { winner, details, fighter1, fighter2 } = action.payload;
			state.winner = winner;
			state.battleDetails = details;
			state.isInProgress = false;

			// Add to battle history
			const battleRecord = {
				id: Date.now(),
				timestamp: new Date().toISOString(),
				fighter1: { ...fighter1 },
				fighter2: { ...fighter2 },
				winner: { ...winner },
				details: { ...details },
			};

			state.battleHistory.unshift(battleRecord);

			// Keep only the latest battles
			if (state.battleHistory.length > state.maxHistorySize) {
				state.battleHistory = state.battleHistory.slice(
					0,
					state.maxHistorySize
				);
			}
		},
		clearBattleHistory: (state) => {
			state.battleHistory = [];
		},
	},
});

export const {
	setFighter,
	removeFighter,
	clearBattle,
	startBattle,
	setBattleResult,
	clearBattleHistory,
} = battleSlice.actions;
export default battleSlice.reducer;
