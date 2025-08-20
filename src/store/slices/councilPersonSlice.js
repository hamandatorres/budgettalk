import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { defaultCouncilPersons } from "../../data/defaultCouncilPersons";

// Create axios instance
const axiosInstance = axios.create({
	baseURL:
		process.env.REACT_APP_API_URL ||
		"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com",
	headers: { "Content-Type": "application/json" },
});

// Initial state
const initialState = {
	list: [],
	loading: false,
	error: null,
};

// Thunk actions
const fetchCouncilPersons = createAsyncThunk(
	"councilPerson/fetchAll",
	async () => {
		const response = await axiosInstance.get("/api/councilperson");
		return response.data;
	}
);

const createCouncilPerson = createAsyncThunk(
	"councilPerson/create",
	async (formData) => {
		const response = await axiosInstance.post("/api/councilperson", formData);
		return response.data;
	}
);

const updateCouncilPerson = createAsyncThunk(
	"councilPerson/update",
	async ({ id, data }) => {
		const response = await axiosInstance.put(`/api/councilperson/${id}`, data);
		return response.data;
	}
);

const deleteAndReplaceCouncilPerson = createAsyncThunk(
	"councilPerson/deleteAndReplace",
	async (id) => {
		const response = await axiosInstance.delete(`/api/councilperson/${id}`);
		return response.data;
	}
);

// Create slice
const councilPersonSlice = createSlice({
	name: "councilPerson",
	initialState,
	reducers: {
		recordWin(state, action) {
			const winner = state.list.find((cp) => cp.id === action.payload);
			if (winner) {
				winner.wins = (winner.wins || 0) + 1;
			}
		},
		eliminateLoser(state, action) {
			const { loserId, partyName } = action.payload || {};
			if (!loserId || !partyName) return;

			const partyMembers = state.list.filter((cp) => cp.party === partyName);
			if (partyMembers.length <= 2) return;

			state.list = state.list.filter((cp) => cp.id !== loserId);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCouncilPersons.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCouncilPersons.fulfilled, (state, action) => {
				state.loading = false;
				state.list = action.payload;
				state.error = null;
			})
			.addCase(fetchCouncilPersons.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
				state.list = defaultCouncilPersons;
			})
			.addCase(createCouncilPerson.fulfilled, (state, action) => {
				state.list.push(action.payload);
			})
			.addCase(updateCouncilPerson.fulfilled, (state, action) => {
				const index = state.list.findIndex((cp) => cp.id === action.payload.id);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
			})
			.addCase(deleteAndReplaceCouncilPerson.fulfilled, (state, action) => {
				const index = state.list.findIndex(
					(cp) => cp.id === action.payload.deleted.id
				);
				if (index !== -1) {
					if (action.payload.replacement) {
						state.list[index] = action.payload.replacement;
					} else {
						state.list.splice(index, 1);
					}
				}
			});
	},
});

// Exports
export {
	fetchCouncilPersons,
	createCouncilPerson,
	updateCouncilPerson,
	deleteAndReplaceCouncilPerson,
};

export const { recordWin, eliminateLoser } = councilPersonSlice.actions;
export default councilPersonSlice.reducer;
