import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { selectAllPosts, fetchPosts, Post } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

const PostExcerpt = ({ post }: { post: Post }) => {
  return (
    <article>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.userId} />
      <TimeAgo timestamp={post.date} />
      <p>{post.content}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`}>View Post</Link>
    </article>
  );
};

export const PostsList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);

  const postStatus = useAppSelector((state) => state.posts.status);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, postStatus]);

  let content;
  if (postStatus === "loading") {
    content = <div>loading...</div>;
  } else {
    const orderedPosts = [...posts].sort(({ date: a }, { date: b }) =>
      b.localeCompare(a)
    );
    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ));
  }

  return (
    <section>
      <h2>PostsList</h2>
      {content}
    </section>
  );
};
