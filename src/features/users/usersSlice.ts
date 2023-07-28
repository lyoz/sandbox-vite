import {
	EntityState,
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../common/client";

export type User = {
	id: string;
	name: string;
};

const usersAdapter = createEntityAdapter<User>();

type UsersState = EntityState<User>;

const initialState: UsersState = usersAdapter.getInitialState();

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
		builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
	},
});

export const usersReducer = usersSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } =
	usersAdapter.getSelectors((state: RootState) => state.users);
