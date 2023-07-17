import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";
import { Post, fetchPosts } from "./postsSlice";

const PostExcerpt = ({ post }: { post: Post }) => (
	<article>
		<h3>{post.title}</h3>
		<div style={{ display: "flex", columnGap: 8 }}>
			<PostAuthor userId={post.userId} />
			<TimeAgo createdAt={post.createdAt} />
		</div>
		<p>{post.content.substring(0, 100)}</p>
		<ReactionButtons post={post} />
		<Link to={`/posts/${post.id}`}>View Post</Link>
	</article>
);

export const PostsList = () => {
	const dispatch = useAppDispatch();
	const posts = useAppSelector((state) => state.posts.posts);
	const postStatus = useAppSelector((state) => state.posts.status);
	const error = useAppSelector((state) => state.posts.error);

	useEffect(() => {
		if (postStatus === "idle") {
			dispatch(fetchPosts());
		}
	}, [dispatch, postStatus]);

	let content: ReactNode = null;
	if (postStatus === "loading") {
		content = <div>Loading...</div>;
	} else if (postStatus === "succeeded") {
		const orderedPosts = [...posts].sort((a, b) =>
			b.createdAt.localeCompare(a.createdAt),
		);
		content = orderedPosts.map((post) => (
			<PostExcerpt key={post.id} post={post} />
		));
	} else if (postStatus === "failed") {
		content = <div>{error}</div>;
	}

	return (
		<section>
			<h2>Posts</h2>
			{content}
		</section>
	);
};
