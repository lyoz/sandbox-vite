import { createSlice } from "@reduxjs/toolkit";

type User = {
	id: string;
	name: string;
};

type UsersState = User[];

const initialState = [
	{ id: "0", name: "Tianna Jenkins" },
	{ id: "1", name: "Kevin Grant" },
	{ id: "2", name: "Madison Price" },
] satisfies UsersState;

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
});

export const usersReducer = usersSlice.reducer;
