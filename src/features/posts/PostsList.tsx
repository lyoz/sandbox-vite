import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";

export const PostsList = () => {
  const posts = useAppSelector((state) => state.posts);
  const orderedPosts = [...posts].sort(({ date: a }, { date: b }) =>
    b.localeCompare(a)
  );
  const renderedPosts = orderedPosts.map((post) => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.userId} />
      <TimeAgo timestamp={post.date} />
      <p>{post.content}</p>
      <Link to={`/posts/${post.id}`}>View Post</Link>
    </article>
  ));
  return (
    <section>
      <h2>PostsList</h2>
      <div>{renderedPosts}</div>
    </section>
  );
};
