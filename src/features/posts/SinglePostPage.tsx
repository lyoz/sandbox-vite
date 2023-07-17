import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { assertIsDefined } from "../../common/assertIsDefined";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const SinglePostPage = () => {
	const posts = useAppSelector((state) => state.posts.posts);
	const { postId } = useParams();
	assertIsDefined(postId);

	const post = posts.find((post) => post.id === postId);

	if (post == null) {
		return (
			<section>
				<h2>Post not found!</h2>
			</section>
		);
	}

	return (
		<section>
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
		</section>
	);
};
