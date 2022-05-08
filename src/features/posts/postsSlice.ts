import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

const initialState = [
  { id: "1", title: "First Post!", content: "Hello!", userId: "0" },
  { id: "2", title: "Second Post", content: "More text", userId: "2" },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<typeof initialState[number]>) => {
        state.push(action.payload);
      },
      prepare: (title: string, content: string, userId: string) => ({
        payload: { id: nanoid(), title, content, userId },
      }),
    },
    postUpdated: (
      state,
      action: PayloadAction<typeof initialState[number]>
    ) => {
      const { id, title, content } = action.payload;
      const post = state.find((p) => p.id === id);
      if (post) Object.assign(post, { title, content });
    },
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

export default postsSlice.reducer;
