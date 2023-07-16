import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

export type Post = {
	id: string;
	title: string;
	content: string;
	userId: string;
	createdAt: string;
};

type PostsState = Post[];

const initialState = [
	{
		id: "1",
		title: "First Post!",
		content: "Hello!",
		userId: "0",
		createdAt: sub(new Date(), { minutes: 10 }).toISOString(),
	},
	{
		id: "2",
		title: "Second Post",
		content: "More text",
		userId: "2",
		createdAt: sub(new Date(), { minutes: 5 }).toISOString(),
	},
] satisfies PostsState;

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
					createdAt: new Date().toISOString(),
				},
			}),
		},
		postUpdated: (
			state,
			action: PayloadAction<Omit<Post, "userId" | "createdAt">>,
		) => {
			const { id, title, content } = action.payload;
			const existingPost = state.find((post) => post.id === id);
			if (existingPost != null) {
				existingPost.title = title;
				existingPost.content = content;
			}
		},
	},
});

export const { postAdded, postUpdated } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
