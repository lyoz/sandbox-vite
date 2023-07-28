import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";
import { fetchPosts, selectPostById, selectPostIds } from "./postsSlice";

const PostExcerpt = ({ postId }: { postId: string }) => {
	const post = useAppSelector((state) => selectPostById(state, postId));

	if (post == null) return null;

	return (
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
};

export const PostsList = () => {
	const dispatch = useAppDispatch();
	const orderedPostIds = useAppSelector(selectPostIds) as string[]; // TODO: strongly type
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
		content = orderedPostIds.map((postId) => (
			<PostExcerpt key={postId} postId={postId} />
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
