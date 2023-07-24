import { Link } from "react-router-dom";
import { fetchNotifications } from "../features/notifications/notificationsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

export const Navbar = () => {
	const dispatch = useAppDispatch();
	const notifications = useAppSelector((state) => state.notifications);

	const fetchNewNotifications = () => {
		dispatch(fetchNotifications());
	};

	const unreadNotifications = notifications.filter((n) => !n.hasBeenRead);
	const unreadNotificationsBadge =
		unreadNotifications.length > 0 ? (
			<span>({unreadNotifications.length})</span>
		) : null;

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
