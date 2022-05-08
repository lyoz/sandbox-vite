import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { postUpdated } from "./postsSlice";

export const EditPostForm = () => {
  const { postId } = useParams<{ postId: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  if (!postId) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }
  const onSave = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content }));
      navigate(`/posts/${postId}`);
    }
  };
  return (
    <section>
      <h2>EditPostForm</h2>
      <form>
        <label>
          Post Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button type="button" onClick={onSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
