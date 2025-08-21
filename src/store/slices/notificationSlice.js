import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notifications",
	initialState: {
		notifications: [],
		maxNotifications: 5,
	},
	reducers: {
		addNotification: {
			prepare: (message, type = "info", duration = 5000) => ({
				payload: {
					id: Date.now() + Math.random(),
					message,
					type, // 'success', 'error', 'warning', 'info'
					duration,
					timestamp: Date.now(),
				},
			}),
			reducer: (state, action) => {
				state.notifications.push(action.payload);
				// Keep only the latest notifications
				if (state.notifications.length > state.maxNotifications) {
					state.notifications = state.notifications.slice(
						-state.maxNotifications
					);
				}
			},
		},
		removeNotification: (state, action) => {
			state.notifications = state.notifications.filter(
				(notification) => notification.id !== action.payload
			);
		},
		clearAllNotifications: (state) => {
			state.notifications = [];
		},
		markAsRead: (state, action) => {
			const notification = state.notifications.find(
				(n) => n.id === action.payload
			);
			if (notification) {
				notification.read = true;
			}
		},
	},
});

export const {
	addNotification,
	removeNotification,
	clearAllNotifications,
	markAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// Utility functions for common notification types
export const createSuccessNotification = (message) =>
	addNotification(message, "success", 3000);
export const createErrorNotification = (message) =>
	addNotification(message, "error", 7000);
export const createWarningNotification = (message) =>
	addNotification(message, "warning", 5000);
export const createInfoNotification = (message) =>
	addNotification(message, "info", 4000);
