import { createSlice } from "@reduxjs/toolkit";

type PostsState = {
	id: string;
	title: string;
	content: string;
}[];

const initialState = [
	{ id: "1", title: "First Post!", content: "Hello!" },
	{ id: "2", title: "Second Post", content: "More text" },
] satisfies PostsState;

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
});

export const postsReducer = postsSlice.reducer;
