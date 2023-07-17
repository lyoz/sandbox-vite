import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const PostsList = () => {
	const posts = useAppSelector((state) => state.posts.posts);

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
