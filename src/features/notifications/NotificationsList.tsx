import { formatDistanceToNow, parseISO } from "date-fns";
import { CSSProperties, useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { User, selectAllUsers } from "../users/usersSlice";
import {
	Notification,
	NotificationMeta,
	allNotificationsRead,
	selectNotificationMetaEntities,
	useGetNotificationsQuery,
} from "./notificationsSlice";

const NotificationExcerpt = ({
	notification,
	notificationMeta,
	user,
}: {
	notification: Notification;
	notificationMeta: NotificationMeta;
	user: Pick<User, "name">;
}) => {
	const date = parseISO(notification.createdAt);
	const timeAgo = formatDistanceToNow(date);

	const style = {
		backgroundColor: notificationMeta.isNew ? "lavender " : undefined,
	} satisfies CSSProperties;

	return (
		<div style={style}>
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
	const dispatch = useAppDispatch();
	const { data: notifications = [] } = useGetNotificationsQuery();
	const notificationMetaEntities = useAppSelector(
		selectNotificationMetaEntities,
	);
	const users = useAppSelector(selectAllUsers);

	useLayoutEffect(() => {
		dispatch(allNotificationsRead());
	});

	return (
		<section>
			<h2>Notifications</h2>
			{notifications.map((notification) => {
				const user =
					users.find((user) => user.id === notification.userId) ??
					({ name: "Unknown User" } satisfies Pick<User, "name">);
				const notificationMeta = notificationMetaEntities[notification.id];
				if (notificationMeta == null) return null; // NOTE: unnecessary in RTK 2.0
				return (
					<NotificationExcerpt
						key={notification.id}
						notification={notification}
						notificationMeta={notificationMeta}
						user={user}
					/>
				);
			})}
		</section>
	);
};
