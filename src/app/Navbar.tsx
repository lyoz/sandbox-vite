import { Link } from "react-router-dom";
import { fetchNotifications } from "../features/notifications/notificationsSlice";
import { useAppDispatch } from "./hooks";

export const Navbar = () => {
	const dispatch = useAppDispatch();

	const fetchNewNotifications = () => {
		dispatch(fetchNotifications());
	};

	return (
		<nav>
			<section>
				<h1>Redux Essentials Example</h1>
				<div style={{ display: "flex", columnGap: 8 }}>
					<Link to="/">Posts</Link>
					<Link to="/users">Users</Link>
					<Link to="/notifications">Notifications</Link>
				</div>
				<button onClick={fetchNewNotifications}>Refrech Notifications</button>
			</section>
		</nav>
	);
};
