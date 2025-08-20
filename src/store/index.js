import { configureStore } from "@reduxjs/toolkit";
import councilPersonReducer from "./slices/councilPersonSlice";
import battleReducer from "./slices/battleSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
	reducer: {
		councilPerson: councilPersonReducer,
		battle: battleReducer,
		ui: uiReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	devTools: process.env.NODE_ENV !== "production",
});

export default store;
