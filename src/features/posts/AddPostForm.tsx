import { useState } from "react";
import { postAdded } from "./postsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const onSave = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId));
    }
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
          Author:
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value=""></option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={onSave}
          disabled={!(title && content && userId)}
        >
          Save Post
        </button>
      </form>
    </section>
  );
};
