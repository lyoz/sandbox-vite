import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { fetchPosts, selectAllPosts } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const PostsList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);

  const postStatus = useAppSelector((state) => state.posts.status);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, postStatus]);

  const orderedPosts = [...posts].sort(({ date: a }, { date: b }) =>
    b.localeCompare(a)
  );
  const renderedPosts = orderedPosts.map((post) => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.userId} />
      <TimeAgo timestamp={post.date} />
      <p>{post.content}</p>
      <ReactionButtons post={post} />
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
