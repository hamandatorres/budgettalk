import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { defaultCouncilPersons } from "../../data/defaultCouncilPersons";

const axiosInstance = axios.create({
	baseURL:
		process.env.REACT_APP_API_URL ||
		"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com",
	headers: { "Content-Type": "application/json" },
});

const slice = createSlice({
	name: "councilPerson",
	initialState: { list: [], loading: false, error: null },
	reducers: {
		recordWin: {
			prepare: (winnerId) => ({ payload: winnerId }),
			reducer(state, { payload }) {
				const cp = state.list.find((p) => p.id === payload);
				if (cp) cp.wins = (cp.wins || 0) + 1;
			},
		},
		eliminateLoser: {
			prepare: (loserId, partyName) => ({ payload: { loserId, partyName } }),
			reducer(state, { payload }) {
				if (!payload?.loserId || !payload?.partyName) return;
				const partySize = state.list.filter(
					(p) => p.party === payload.partyName
				).length;
				if (partySize > 2) {
					state.list = state.list.filter((p) => p.id !== payload.loserId);
				}
			},
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase("councilPerson/fetchAll/pending", (state) => {
				state.loading = true;
			})
			.addCase("councilPerson/fetchAll/fulfilled", (state, action) => {
				state.loading = false;
				state.list = action.payload;
				state.error = null;
			})
			.addCase("councilPerson/fetchAll/rejected", (state, action) => {
				state.loading = false;
				state.error = action.error.message;
				state.list = defaultCouncilPersons;
			})
			.addCase("councilPerson/create/fulfilled", (state, action) => {
				state.list.push(action.payload);
			})
			.addCase("councilPerson/update/fulfilled", (state, action) => {
				const idx = state.list.findIndex((p) => p.id === action.payload.id);
				if (idx >= 0) state.list[idx] = action.payload;
			})
			.addCase("councilPerson/deleteAndReplace/fulfilled", (state, action) => {
				const idx = state.list.findIndex(
					(p) => p.id === action.payload.deleted.id
				);
				if (idx >= 0) {
					if (action.payload.replacement)
						state.list[idx] = action.payload.replacement;
					else state.list.splice(idx, 1);
				}
			});
	},
});

export const fetchCouncilPersons = createAsyncThunk(
	"councilPerson/fetchAll",
	async () => (await axiosInstance.get("/api/councilperson")).data
);

export const createCouncilPerson = createAsyncThunk(
	"councilPerson/create",
	async (formData) =>
		(await axiosInstance.post("/api/councilperson", formData)).data
);

export const updateCouncilPerson = createAsyncThunk(
	"councilPerson/update",
	async ({ id, data }) =>
		(await axiosInstance.put(`/api/councilperson/${id}`, data)).data
);

export const deleteAndReplaceCouncilPerson = createAsyncThunk(
	"councilPerson/deleteAndReplace",
	async (id) => (await axiosInstance.delete(`/api/councilperson/${id}`)).data
);

export const { recordWin, eliminateLoser } = slice.actions;
export default slice.reducer;
