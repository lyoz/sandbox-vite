import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

export type User = {
	id: string;
	name: string;
};

/* Temporarily ignore adapter
const usersAdapter = createEntityAdapter<User>();

type UsersState = EntityState<User>;

const initialState: UsersState = usersAdapter.getInitialState();
*/

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<User[], void>({
			query: () => "users",
		}),
	}),
});

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select();

const emptyUsers: User[] = [];

export const selectAllUsers = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data ?? emptyUsers,
);

export const selectUserById = createSelector(
	[selectAllUsers, (_: RootState, userId: string) => userId],
	(users, userId) => users.find((user) => user.id === userId),
);

/* Temporarily ignore selectors
export const { selectAll: selectAllUsers, selectById: selectUserById } =
	usersAdapter.getSelectors((state: RootState) => state.users);
*/
