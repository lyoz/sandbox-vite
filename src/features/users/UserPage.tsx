import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { assertIsDefined } from "../../common/assertIsDefined";
import { Post, useGetPostsQuery } from "../posts/postsSlice";
import { User, selectUserById } from "./usersSlice";

const UserPageInner = ({ user }: { user: User }) => {
	const selectPostsByUserId = useMemo(() => {
		const emptyArray: Post[] = [];
		type QueryResult = { data?: Post[] };
		return createSelector(
			[
				(result: QueryResult) => result.data,
				(_: QueryResult, userId: string) => userId,
			],
			(data, userId) =>
				data?.filter((post) => post.userId === userId) ?? emptyArray,
		);
	}, []);

	const { postsForUser } = useGetPostsQuery(undefined, {
		selectFromResult: (result) => ({
			postsForUser: selectPostsByUserId(result, user.id),
		}),
	});

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
	const { userId } = useParams();
	assertIsDefined(userId);
	const user = useAppSelector((state) => selectUserById(state, userId));

	if (user == null) {
		return (
			<section>
				<h2>User not found!</h2>
			</section>
		);
	}

	return <UserPageInner user={user} />;
};
