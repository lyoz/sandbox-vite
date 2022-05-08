import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const initialState = [
  { id: "1", title: "First Post!", content: "Hello!" },
  { id: "2", title: "Second Post", content: "More text" },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; title: string; content: string }>
      ) => {
        state.push(action.payload);
      },
      prepare: (title: string, content: string) => ({
        payload: { id: nanoid(), title, content },
      }),
    },
    postUpdated: (
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>
    ) => {
      const { id, title, content } = action.payload;
      const post = state.find((p) => p.id === id);
      if (post) Object.assign(post, { title, content });
    },
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

export const selectPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;
