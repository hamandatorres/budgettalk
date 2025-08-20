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
			prepare: (payload) => ({ payload }),
			reducer(state, { payload }) {
				if (!payload?.loserId || !payload?.partyName) return;
				const partyMembers = state.list.filter(
					(p) => p.party === payload.partyName
				);

				// Only eliminate if there are more than 2 members in the party
				if (partyMembers.length > 2) {
					state.list = state.list.filter((p) => p.id !== payload.loserId);
				} else {
					console.log(
						`Cannot eliminate member - party ${payload.partyName} only has ${partyMembers.length} members`
					);
				}
			},
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
				const idx = state.list.findIndex((p) => p.id === action.payload.id);
				if (idx >= 0) state.list[idx] = action.payload;
			})
			.addCase(deleteAndReplaceCouncilPerson.fulfilled, (state, action) => {
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
