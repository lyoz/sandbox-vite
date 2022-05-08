import { useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export const SinglePostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = useAppSelector((state) =>
    state.posts.find((post) => post.id === postId)
  );
  if (!post) {
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
      </article>
    </section>
  );
};
