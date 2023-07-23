import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../common/client";

export type User = {
	id: string;
	name: string;
};

type UsersState = User[];

const initialState: UsersState = [];

export const fetchUsers = createAsyncThunk<User[]>(
	"users/fetchUsers",
	async () => {
		const response = await client.get("/fakeApi/users");
		return response.data;
	},
);

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUsers.fulfilled, (_, action) => {
			return action.payload;
		});
	},
});

export const usersReducer = usersSlice.reducer;
