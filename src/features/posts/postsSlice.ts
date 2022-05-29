import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../client";

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

const initialState: {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
} = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await client.get("/fakeApi/posts");
  return res.data as Post[];
});

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [...state.posts, ...action.payload];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);
