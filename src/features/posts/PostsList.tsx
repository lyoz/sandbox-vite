import { useSelector } from "react-redux";
import { selectPosts } from "./postsSlice";

export const PostsList = () => {
  const posts = useSelector(selectPosts);
  const renderedPosts = posts.map((post) => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </article>
  ));
  return (
    <section>
      <h2>PostsList</h2>
      <div>{renderedPosts}</div>
    </section>
  );
};
