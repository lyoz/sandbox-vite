import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { assertIsDefined } from "../../common/assertIsDefined";

export const SinglePostPage = () => {
	const posts = useAppSelector((state) => state.posts);
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
				<p>{post.content}</p>
				<Link to={`/editPost/${post.id}`}>Edit Post</Link>
			</article>
		</section>
	);
};
