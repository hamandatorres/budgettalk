import { createSlice } from '@reduxjs/toolkit';

const battleSlice = createSlice({
  name: 'battle',
  initialState: {
    selectedFighter1: null,
    selectedFighter2: null,
    winner: null,
    battleDetails: null
  },
  reducers: {
    setFighter: (state, action) => {
      const { position, fighter } = action.payload;
      if (position === 'fighter1') {
        state.selectedFighter1 = fighter;
      } else {
        state.selectedFighter2 = fighter;
      }
    },
    removeFighter: (state, action) => {
      const position = action.payload;
      if (position === 'fighter1') {
        state.selectedFighter1 = null;
      } else {
        state.selectedFighter2 = null;
      }
      state.winner = null;
      state.battleDetails = null;
    },
    clearBattle: (state) => {
      state.winner = null;
      state.battleDetails = null;
    },
    setBattleResult: (state, action) => {
      const { winner, details } = action.payload;
      state.winner = winner;
      state.battleDetails = details;
    }
  }
});

export const { setFighter, removeFighter, clearBattle, setBattleResult } = battleSlice.actions;
export default battleSlice.reducer;
