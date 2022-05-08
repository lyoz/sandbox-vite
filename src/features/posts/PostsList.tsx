import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export const PostsList = () => {
  const posts = useAppSelector((state) => state.posts);
  const renderedPosts = posts.map((post) => (
    <article key={post.id}>
      <h3>{post.title}</h3>
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
