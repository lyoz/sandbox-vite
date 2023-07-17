import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";
import { fetchPosts } from "./postsSlice";

export const PostsList = () => {
	const dispatch = useAppDispatch();
	const posts = useAppSelector((state) => state.posts.posts);
	const postStatus = useAppSelector((state) => state.posts.status);

	useEffect(() => {
		if (postStatus === "idle") {
			dispatch(fetchPosts());
		}
	}, [dispatch, postStatus]);

	const orderedPosts = [...posts].sort((a, b) =>
		b.createdAt.localeCompare(a.createdAt),
	);

	return (
		<section>
			<h2>Posts</h2>
			{orderedPosts.map((post) => (
				<article key={post.id}>
					<h3>{post.title}</h3>
					<div style={{ display: "flex", columnGap: 8 }}>
						<PostAuthor userId={post.userId} />
						<TimeAgo createdAt={post.createdAt} />
					</div>
					<p>{post.content.substring(0, 100)}</p>
					<ReactionButtons post={post} />
					<Link to={`/posts/${post.id}`}>View Post</Link>
				</article>
			))}
		</section>
	);
};
