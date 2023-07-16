import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";

export const PostsList = () => {
	const posts = useAppSelector((state) => state.posts);

	return (
		<section>
			<h2>Posts</h2>
			{posts.map((post) => (
				<article key={post.id}>
					<h3>{post.title}</h3>
					<PostAuthor userId={post.userId} />
					<p>{post.content.substring(0, 100)}</p>
					<Link to={`/posts/${post.id}`}>View Post</Link>
				</article>
			))}
		</section>
	);
};
