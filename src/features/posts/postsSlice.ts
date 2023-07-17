import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";

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
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
