import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const generateInitialReactions = () => {
  return {
    "+1": 0,
    "-1": 0,
    hooray: 0,
    rocket: 0,
    eyes: 0,
  };
};

export type ReactionKey = keyof ReturnType<typeof generateInitialReactions>;

const initialState = [
  {
    id: "1",
    title: "First Post!",
    content: "Hello!",
    userId: "0",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: generateInitialReactions(),
  },
  {
    id: "2",
    title: "Second Post",
    content: "More text",
    userId: "2",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: generateInitialReactions(),
  },
];

export type Post = typeof initialState[number];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload);
      },
      prepare: (title: string, content: string, userId: string) => ({
        payload: {
          id: nanoid(),
          date: new Date().toISOString(),
          reactions: generateInitialReactions(),
          title,
          content,
          userId,
        },
      }),
    },
    postUpdated: (state, action: PayloadAction<Partial<Post>>) => {
      const { id, title, content, date } = action.payload;
      const post = state.find((p) => p.id === id);
      if (post) Object.assign(post, { title, content, date });
    },
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionKey }>
    ) => {
      const { postId, reaction } = action.payload;
      const post = state.find((p) => p.id === postId);
      if (post) post.reactions[reaction]++;
    },
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
