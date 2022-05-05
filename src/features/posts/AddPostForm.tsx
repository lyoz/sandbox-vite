import { useState } from "react";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        <button type="button">Save Post</button>
      </form>
    </section>
  );
};
