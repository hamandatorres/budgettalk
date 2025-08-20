import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
	name: "ui",
	initialState: {
		isModalOpen: false,
		expandedParty: null,
	},
	reducers: {
		toggleModal: (state) => {
			state.isModalOpen = !state.isModalOpen;
		},
		setExpandedParty: (state, action) => {
			state.expandedParty =
				action.payload === state.expandedParty ? null : action.payload;
		},
	},
});

export const { toggleModal, setExpandedParty } = uiSlice.actions;
export default uiSlice.reducer;
