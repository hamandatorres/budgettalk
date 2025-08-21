import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "../store/slices/notificationSlice";
import "./NotificationSystem.css";

const NotificationSystem = () => {
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state) => state.notifications.notifications
	);

	useEffect(() => {
		notifications.forEach((notification) => {
			if (notification.duration > 0) {
				const timer = setTimeout(() => {
					dispatch(removeNotification(notification.id));
				}, notification.duration);

				return () => clearTimeout(timer);
			}
		});
	}, [notifications, dispatch]);

	if (notifications.length === 0) return null;

	const getNotificationClasses = (type) => {
		return `notification ${type}`;
	};

	return (
		<div className="notification-container">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={getNotificationClasses(notification.type)}
					onClick={() => dispatch(removeNotification(notification.id))}
				>
					{notification.message}
				</div>
			))}
		</div>
	);
};

export default NotificationSystem;
