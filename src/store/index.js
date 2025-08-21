import { configureStore } from "@reduxjs/toolkit";
import councilPersonReducer from "./slices/councilPersonSlice";
import battleReducer from "./slices/battleSlice";
import uiReducer from "./slices/uiSlice";
import selectionReducer from "./slices/selectionSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
	reducer: {
		councilPerson: councilPersonReducer,
		battle: battleReducer,
		ui: uiReducer,
		selection: selectionReducer,
		notifications: notificationReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	devTools: process.env.NODE_ENV !== "production",
});

export default store;
