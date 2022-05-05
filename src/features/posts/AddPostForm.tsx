import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { postAdded } from "./postsSlice";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();
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
        <button
          type="button"
          onClick={() => {
            console.log("onClick");
            dispatch(postAdded({ id: nanoid(), title, content }));
          }}
        >
          Save Post
        </button>
      </form>
    </section>
  );
};
