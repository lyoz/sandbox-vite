import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { selectPostById } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";

export const SinglePostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = useAppSelector((state) => selectPostById(state, postId ?? ""));
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
        <PostAuthor userId={post.userId} />
        <p>{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`}>Edit Post</Link>
      </article>
    </section>
  );
};
