import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { assertIsDefined } from "../../common/assertIsDefined";
import { User } from "./usersSlice";

const UserPageInner = ({ user }: { user: User }) => {
	const posts = useAppSelector((state) => state.posts.posts);
	const postsForUser = posts.filter((post) => post.userId === user.id);

	return (
		<section>
			<h2>{user.name}</h2>
			<ul>
				{postsForUser.map((post) => (
					<li key={post.id}>
						<Link to={`/posts/${post.id}`}>{post.title}</Link>
					</li>
				))}
			</ul>
		</section>
	);
};

export const UserPage = () => {
	const users = useAppSelector((state) => state.users);
	const { userId } = useParams();
	assertIsDefined(userId);

	const user = users.find((user) => user.id === userId);

	if (user == null) {
		return (
			<section>
				<h2>User not found!</h2>
			</section>
		);
	}

	return <UserPageInner user={user} />;
};
