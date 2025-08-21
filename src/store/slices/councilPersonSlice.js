import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { defaultCouncilPersons } from "../../data/defaultCouncilPersons";
import { POLITICAL_ICONS } from "../../data/politicalIcons";

// Enhanced axios instance with retry logic
const axiosInstance = axios.create({
	baseURL:
		process.env.REACT_APP_API_URL ||
		"https://evening-cliffs-17109-56706eeb61a8.herokuapp.com",
	headers: { "Content-Type": "application/json" },
	timeout: 10000, // 10 second timeout
});

// Add retry interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const { config } = error;

		// Don't retry if we've already retried or if it's a 4xx error
		if (config._retry || (error.response && error.response.status < 500)) {
			return Promise.reject(error);
		}

		config._retry = true;
		config.retryCount = (config.retryCount || 0) + 1;

		// Only retry up to 3 times
		if (config.retryCount <= 3) {
			// Wait before retrying (exponential backoff)
			await new Promise((resolve) =>
				setTimeout(resolve, 1000 * config.retryCount)
			);
			return axiosInstance(config);
		}

		return Promise.reject(error);
	}
);

const slice = createSlice({
	name: "councilPerson",
	initialState: {
		list: [],
		loading: false,
		error: null,
		createLoading: false,
		updateLoading: false,
		deleteLoading: false,
		lastOperation: null,
	},
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		setLastOperation: (state, action) => {
			state.lastOperation = action.payload;
		},
		// Optimistic update for record win
		recordWin: {
			prepare: (winnerId) => ({ payload: winnerId }),
			reducer(state, { payload }) {
				const cp = state.list.find((p) => p.id === payload);
				if (cp) {
					cp.wins = (cp.wins || 0) + 1;
					state.lastOperation = {
						type: "win",
						memberId: payload,
						timestamp: Date.now(),
					};
				}
			},
		},
		// Optimistic update for eliminate loser
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
					state.lastOperation = {
						type: "eliminate",
						memberId: payload.loserId,
						partyName: payload.partyName,
						timestamp: Date.now(),
					};
				} else {
					console.log(
						`Cannot eliminate member - party ${payload.partyName} only has ${partyMembers.length} members`
					);
				}
			},
		},
		startNewSession: {
			reducer(state) {
				// Group members by party
				const partyGroups = state.list.reduce((groups, person) => {
					const party = person.party || "Independent";
					if (!groups[party]) {
						groups[party] = [];
					}
					groups[party].push(person);
					return groups;
				}, {});

				// For each party, keep only top 2 members by wins
				const newList = [];
				Object.entries(partyGroups).forEach(([party, members]) => {
					// Sort by wins (descending)
					const sortedMembers = [...members].sort((a, b) => {
						const winsA = a.wins || 0;
						const winsB = b.wins || 0;
						if (winsB !== winsA) return winsB - winsA;
						// If wins are equal, randomize
						return Math.random() - 0.5;
					});

					// Keep only top 2 members
					const survivors = sortedMembers.slice(0, 2);
					survivors.forEach((member) => {
						// Reset wins for new session
						member.wins = 0;
					});
					newList.push(...survivors);
				});

				state.list = newList;
			},
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch Council Persons
			.addCase(fetchCouncilPersons.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCouncilPersons.fulfilled, (state, action) => {
				state.loading = false;
				// Assign random avatars to members who don't have one
				state.list = action.payload.map((person) => {
					if (!person.avatarId) {
						const randomIcon =
							POLITICAL_ICONS[
								Math.floor(Math.random() * POLITICAL_ICONS.length)
							];
						return { ...person, avatarId: randomIcon.id };
					}
					return person;
				});
				state.error = null;
				state.lastOperation = { type: "fetch", timestamp: Date.now() };
			})
			.addCase(fetchCouncilPersons.rejected, (state, action) => {
				state.loading = false;
				state.error = {
					message: action.error.message || "Failed to fetch council persons",
					code: action.error.code,
					timestamp: Date.now(),
				};
				// Fallback to default data
				state.list = defaultCouncilPersons.map((person) => {
					if (!person.avatarId) {
						const randomIcon =
							POLITICAL_ICONS[
								Math.floor(Math.random() * POLITICAL_ICONS.length)
							];
						return { ...person, avatarId: randomIcon.id };
					}
					return person;
				});
			})

			// Create Council Person
			.addCase(createCouncilPerson.pending, (state) => {
				state.createLoading = true;
				state.error = null;
			})
			.addCase(createCouncilPerson.fulfilled, (state, action) => {
				state.createLoading = false;
				state.list.push(action.payload);
				state.lastOperation = {
					type: "create",
					memberId: action.payload.id,
					timestamp: Date.now(),
				};
			})
			.addCase(createCouncilPerson.rejected, (state, action) => {
				state.createLoading = false;
				state.error = {
					message: action.error.message || "Failed to create council person",
					code: action.error.code,
					timestamp: Date.now(),
				};
			})

			// Update Council Person
			.addCase(updateCouncilPerson.pending, (state) => {
				state.updateLoading = true;
				state.error = null;
			})
			.addCase(updateCouncilPerson.fulfilled, (state, action) => {
				state.updateLoading = false;
				const idx = state.list.findIndex((p) => p.id === action.payload.id);
				if (idx >= 0) {
					state.list[idx] = action.payload;
					state.lastOperation = {
						type: "update",
						memberId: action.payload.id,
						timestamp: Date.now(),
					};
				}
			})
			.addCase(updateCouncilPerson.rejected, (state, action) => {
				state.updateLoading = false;
				state.error = {
					message: action.error.message || "Failed to update council person",
					code: action.error.code,
					timestamp: Date.now(),
				};
			})

			// Delete and Replace Council Person
			.addCase(deleteAndReplaceCouncilPerson.pending, (state) => {
				state.deleteLoading = true;
				state.error = null;
			})
			.addCase(deleteAndReplaceCouncilPerson.fulfilled, (state, action) => {
				state.deleteLoading = false;
				const idx = state.list.findIndex(
					(p) => p.id === action.payload.deleted.id
				);
				if (idx >= 0) {
					if (action.payload.replacement) {
						// Assign random avatar to replacement if needed
						if (!action.payload.replacement.avatarId) {
							const randomIcon =
								POLITICAL_ICONS[
									Math.floor(Math.random() * POLITICAL_ICONS.length)
								];
							action.payload.replacement.avatarId = randomIcon.id;
						}
						state.list[idx] = action.payload.replacement;
					} else {
						state.list.splice(idx, 1);
					}
					state.lastOperation = {
						type: "delete",
						memberId: action.payload.deleted.id,
						replacementId: action.payload.replacement?.id,
						timestamp: Date.now(),
					};
				}
			})
			.addCase(deleteAndReplaceCouncilPerson.rejected, (state, action) => {
				state.deleteLoading = false;
				state.error = {
					message: action.error.message || "Failed to delete council person",
					code: action.error.code,
					timestamp: Date.now(),
				};
			});
	},
});

export const fetchCouncilPersons = createAsyncThunk(
	"councilPerson/fetchAll",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get("/api/councilperson");
			return response.data;
		} catch (error) {
			return rejectWithValue({
				message:
					error.response?.data?.message || error.message || "Network error",
				status: error.response?.status,
				code: error.code,
			});
		}
	}
);

export const createCouncilPerson = createAsyncThunk(
	"councilPerson/create",
	async (formData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post("/api/councilperson", formData);
			return response.data;
		} catch (error) {
			return rejectWithValue({
				message:
					error.response?.data?.message ||
					error.message ||
					"Failed to create council person",
				status: error.response?.status,
				code: error.code,
			});
		}
	}
);

export const updateCouncilPerson = createAsyncThunk(
	"councilPerson/update",
	async ({ id, data }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put(
				`/api/councilperson/${id}`,
				data
			);
			return response.data;
		} catch (error) {
			return rejectWithValue({
				message:
					error.response?.data?.message ||
					error.message ||
					"Failed to update council person",
				status: error.response?.status,
				code: error.code,
			});
		}
	}
);

export const deleteAndReplaceCouncilPerson = createAsyncThunk(
	"councilPerson/deleteAndReplace",
	async (id, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.delete(`/api/councilperson/${id}`);
			return response.data;
		} catch (error) {
			return rejectWithValue({
				message:
					error.response?.data?.message ||
					error.message ||
					"Failed to delete council person",
				status: error.response?.status,
				code: error.code,
			});
		}
	}
);

export const {
	recordWin,
	eliminateLoser,
	startNewSession,
	clearError,
	setLastOperation,
} = slice.actions;
export default slice.reducer;
