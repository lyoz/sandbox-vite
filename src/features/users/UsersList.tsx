import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export const UsersList = () => {
	const users = useAppSelector((state) => state.users);

	return (
		<section>
			<h2>Users</h2>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						<Link to={`/users/${user.id}`}>{user.name}</Link>
					</li>
				))}
			</ul>
		</section>
	);
};
