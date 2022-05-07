import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../app/store";

export const SinglePostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = useSelector((state: RootState) =>
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
