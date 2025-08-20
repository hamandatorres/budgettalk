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
});

export default store;
