import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const generateInitialReactions = () => ({
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
});

export type ReactionKey = keyof ReturnType<typeof generateInitialReactions>;

export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  date: string;
  reactions: ReturnType<typeof generateInitialReactions>;
};

const initialState = {
  posts: [] as Post[],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.posts.push(action.payload);
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
      const post = state.posts.find((p) => p.id === id);
      if (post) Object.assign(post, { title, content, date });
    },
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionKey }>
    ) => {
      const { postId, reaction } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) post.reactions[reaction]++;
    },
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);
