import { useState } from "react";
import { postAdded } from "./postsSlice";
import { useAppDispatch } from "../../app/hooks";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();
  const onSave = () => {
    dispatch(postAdded(title, content));
  };
  return (
    <section>
      <h2>AddPostForm</h2>
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
