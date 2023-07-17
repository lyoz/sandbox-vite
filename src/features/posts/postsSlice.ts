import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

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

type PostsState = Post[];

const initialState: PostsState = [
	{
		id: "1",
		title: "First Post!",
		content: "Hello!",
		userId: "0",
		reactionCounts: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
		createdAt: sub(new Date(), { minutes: 10 }).toISOString(),
	},
	{
		id: "2",
		title: "Second Post",
		content: "More text",
		userId: "2",
		reactionCounts: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
		createdAt: sub(new Date(), { minutes: 5 }).toISOString(),
	},
];

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
			const existingPost = state.find((post) => post.id === id);
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
			const existingPost = state.find((post) => post.id === postId);
			if (existingPost != null) {
				existingPost.reactionCounts[reactionKey]++;
			}
		},
	},
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
