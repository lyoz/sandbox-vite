import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Post = {
	id: string;
	title: string;
	content: string;
};

type PostsState = Post[];

const initialState = [
	{ id: "1", title: "First Post!", content: "Hello!" },
	{ id: "2", title: "Second Post", content: "More text" },
] satisfies PostsState;

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postAdded: (state, action: PayloadAction<Post>) => {
			state.push(action.payload);
		},
	},
});

export const { postAdded } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
