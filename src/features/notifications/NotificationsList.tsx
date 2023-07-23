import { formatDistanceToNow, parseISO } from "date-fns";
import { useAppSelector } from "../../app/hooks";
import { User } from "../users/usersSlice";
import { Notification } from "./notificationsSlice";

const NotificationExcerpt = ({
	notification,
	user,
}: {
	notification: Notification;
	user: Pick<User, "name">;
}) => {
	const date = parseISO(notification.createdAt);
	const timeAgo = formatDistanceToNow(date);

	return (
		<div>
			<div>
				<b>{user.name}</b> {notification.message}
			</div>
			<div>
				<i>{timeAgo} ago</i>
			</div>
		</div>
	);
};

export const NotificationsList = () => {
	const notifications = useAppSelector((state) => state.notifications);
	const users = useAppSelector((state) => state.users);

	return (
		<section>
			<h2>Notifications</h2>
			{notifications.map((notification) => {
				const user =
					users.find((user) => user.id === notification.userId) ??
					({ name: "Unknown User" } satisfies Pick<User, "name">);
				return (
					<NotificationExcerpt
						key={notification.id}
						notification={notification}
						user={user}
					/>
				);
			})}
		</section>
	);
};
