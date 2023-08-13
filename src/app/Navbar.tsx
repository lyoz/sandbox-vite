import { Link } from "react-router-dom";
import {
	fetchNotificationsWebSocket,
	selectAllNotificationMetas,
	useGetNotificationsQuery,
} from "../features/notifications/notificationsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

export const Navbar = () => {
	const dispatch = useAppDispatch();
	useGetNotificationsQuery();
	const notificationMetas = useAppSelector(selectAllNotificationMetas);

	const fetchNewNotifications = () => {
		dispatch(fetchNotificationsWebSocket());
	};

	const unreadCount = notificationMetas.filter((n) => !n.hasBeenRead).length;
	const unreadNotificationsBadge =
		unreadCount > 0 ? <span>({unreadCount})</span> : null;

	return (
		<nav>
			<section>
				<h1>Redux Essentials Example</h1>
				<div style={{ display: "flex", columnGap: 8 }}>
					<Link to="/">Posts</Link>
					<Link to="/users">Users</Link>
					<Link to="/notifications">
						Notifications {unreadNotificationsBadge}
					</Link>
					<button onClick={fetchNewNotifications}>Refrech Notifications</button>
				</div>
			</section>
		</nav>
	);
};
