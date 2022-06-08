import { useState } from "react";
import { addNewPost } from "./postsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";
  const onSave = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(addNewPost({ title, content, userId })).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post:", err);
      } finally {
        setAddRequestStatus("idle");
      }
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
        <button type="button" onClick={onSave} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
