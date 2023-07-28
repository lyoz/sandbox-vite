import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetPostsQuery } from "../api/apiSlice";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";
import { Post } from "./postsSlice";

const PostExcerpt = ({ post }: { post: Post }) => {
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

const getErrorMessage = (error: FetchBaseQueryError | SerializedError) => {
	if ("status" in error) {
		return "error" in error ? error.error : JSON.stringify(error.data);
	} else {
		return error.message ?? "Unexpected error";
	}
};

export const PostsList = () => {
	const {
		data: posts = [],
		error,
		isLoading,
		isSuccess,
		isError,
	} = useGetPostsQuery();

	const orderedPosts = useMemo(() => {
		return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}, [posts]);

	let content: ReactNode = null;
	if (isLoading) {
		content = <div>Loading...</div>;
	} else if (isSuccess) {
		content = orderedPosts.map((post) => (
			<PostExcerpt key={post.id} post={post} />
		));
	} else if (isError) {
		content = <div>{getErrorMessage(error)}</div>;
	}

	return (
		<section>
			<h2>Posts</h2>
			{content}
		</section>
	);
};
