import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { defaultCouncilPersons } from "../../data/defaultCouncilPersons";

const axiosInstance = axios.create({
	baseURL:
		process.env.REACT_APP_API_URL ||
		"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com",
	headers: {
		"Content-Type": "application/json",
	},
});

export const fetchCouncilPersons = createAsyncThunk(
	"councilPerson/fetchAll",
	async () => {
		const response = await axiosInstance.get("/api/councilperson");
		return response.data;
	}
);

export const createCouncilPerson = createAsyncThunk(
	"councilPerson/create",
	async (formData) => {
		const response = await axiosInstance.post("/api/councilperson", formData);
		return response.data;
	}
);

export const updateCouncilPerson = createAsyncThunk(
	"councilPerson/update",
	async ({ id, data }) => {
		const response = await axiosInstance.put(`/api/councilperson/${id}`, data);
		return response.data;
	}
);

export const deleteAndReplaceCouncilPerson = createAsyncThunk(
	"councilPerson/deleteAndReplace",
	async (id) => {
		const response = await axiosInstance.delete(`/api/councilperson/${id}`);
		return response.data;
	}
);

const councilPersonSlice = createSlice({
	name: "councilPerson",
	initialState: {
		list: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch council persons
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
				// Use default data when API is not available
				state.list = defaultCouncilPersons;
			})
			// Create council person
			.addCase(createCouncilPerson.fulfilled, (state, action) => {
				state.list.push(action.payload);
			})
			// Update council person
			.addCase(updateCouncilPerson.fulfilled, (state, action) => {
				const index = state.list.findIndex((cp) => cp.id === action.payload.id);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
			})
			// Delete and replace council person
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

export default councilPersonSlice.reducer;
