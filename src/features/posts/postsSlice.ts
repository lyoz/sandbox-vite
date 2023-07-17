import {
	PayloadAction,
	createAsyncThunk,
	createSlice,
	nanoid,
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
					title,
					content,
					userId,
					reactionCounts: {
						thumbsUp: 0,
						hooray: 0,
						heart: 0,
						rocket: 0,
						eyes: 0,
					},
					createdAt: new Date().toISOString(),
				},
			}),
		},
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
			});
	},
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
