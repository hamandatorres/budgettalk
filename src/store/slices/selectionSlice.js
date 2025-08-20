import { createSlice } from "@reduxjs/toolkit";

const selectionSlice = createSlice({
	name: "selection",
	initialState: {
		selectedMemberId: null,
	},
	reducers: {
		setSelectedMember: (state, action) => {
			state.selectedMemberId = action.payload;
		},
		clearSelectedMember: (state) => {
			state.selectedMemberId = null;
		},
	},
});

export const { setSelectedMember, clearSelectedMember } =
	selectionSlice.actions;
export default selectionSlice.reducer;
