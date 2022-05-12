import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = [
  {
    id: "1",
    title: "First Post!",
    content: "Hello!",
    userId: "0",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
  },
  {
    id: "2",
    title: "Second Post",
    content: "More text",
    userId: "2",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
  },
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
        payload: {
          id: nanoid(),
          date: new Date().toISOString(),
          title,
          content,
          userId,
        },
      }),
    },
    postUpdated: (
      state,
      action: PayloadAction<Partial<typeof initialState[number]>>
    ) => {
      const { id, title, content, date } = action.payload;
      const post = state.find((p) => p.id === id);
      if (post) Object.assign(post, { title, content, date });
    },
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

export default postsSlice.reducer;
