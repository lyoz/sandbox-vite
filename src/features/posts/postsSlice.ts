import {
	PayloadAction,
	createAsyncThunk,
	createSelector,
	createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../common/client";

export const reactionKeys = [
	"thumbsUp",
	"hooray",
	"heart",
	"rocket",
	"eyes",
] as const;

export type ReactionKey = (typeof reactionKeys)[number];

export type Post = {
	id: string;
	title: string;
	content: string;
	userId: string;
	reactionCounts: Record<ReactionKey, number>;
	createdAt: string;
};

type PostsState = {
	posts: Post[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
};

const initialState: PostsState = {
	posts: [],
	status: "idle",
	error: null,
};

export const fetchPosts = createAsyncThunk<Post[], void, { state: RootState }>(
	"posts/fetchPosts",
	async () => {
		const response = await client.get("/fakeApi/posts");
		return response.data;
	},
	{
		condition: (_, { getState }) => {
			const { posts } = getState();
			return posts.status !== "loading";
		},
	},
);

export const addNewPost = createAsyncThunk<
	Post,
	Omit<Post, "id" | "reactionCounts" | "createdAt">
>("posts/addNewPost", async (post) => {
	const body = JSON.stringify(post);
	const response = await client.post("/fakeApi/posts", body);
	return response.data;
});

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postUpdated: (
			state,
			action: PayloadAction<
				Omit<Post, "userId" | "reactionCounts" | "createdAt">
			>,
		) => {
			const { id, title, content } = action.payload;
			const existingPost = state.posts.find((post) => post.id === id);
			if (existingPost != null) {
				existingPost.title = title;
				existingPost.content = content;
			}
		},
		reactionAdded: (
			state,
			action: PayloadAction<{ postId: string; reactionKey: ReactionKey }>,
		) => {
			const { postId, reactionKey } = action.payload;
			const existingPost = state.posts.find((post) => post.id === postId);
			if (existingPost != null) {
				existingPost.reactionCounts[reactionKey]++;
			}
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
				state.error = action.error.message ?? "Unexpected error";
			})
			.addCase(addNewPost.fulfilled, (state, action) => {
				state.posts.push(action.payload);
			});
	},
});

export const { postUpdated, reactionAdded } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;

export const selectPostsByUserId = createSelector(
	[
		(state: RootState) => state.posts.posts,
		(_: RootState, userId: string) => userId,
	],
	(posts, userId) => posts.filter((post) => post.userId === userId),
);
