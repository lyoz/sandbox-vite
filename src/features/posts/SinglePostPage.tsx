import { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { assertIsDefined } from "../../common/assertIsDefined";
import { useGetPostQuery } from "../posts/postsSlice";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const SinglePostPage = () => {
	const { postId } = useParams();
	assertIsDefined(postId);
	const { data: post, isFetching, isSuccess } = useGetPostQuery(postId);

	let content: ReactNode = null;
	if (isFetching) {
		content = <div>Loading...</div>;
	} else if (isSuccess) {
		content = (
			<article>
				<h2>{post.title}</h2>
				<div style={{ display: "flex", columnGap: 8 }}>
					<PostAuthor userId={post.userId} />
					<TimeAgo createdAt={post.createdAt} />
				</div>
				<p>{post.content}</p>
				<ReactionButtons post={post} />
				<Link to={`/editPost/${post.id}`}>Edit Post</Link>
			</article>
		);
	}

	return <section>{content}</section>;
};
