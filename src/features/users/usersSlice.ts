import {
	EntityState,
	createEntityAdapter,
	createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

export type User = {
	id: string;
	name: string;
};

const usersAdapter = createEntityAdapter<User>();

type UsersState = EntityState<User>;

const initialState: UsersState = usersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<UsersState, void>({
			query: () => "users",
			transformResponse: (responseData: User[]) =>
				usersAdapter.setAll(initialState, responseData),
		}),
	}),
});

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data,
);

export const { selectAll: selectAllUsers, selectById: selectUserById } =
	usersAdapter.getSelectors(
		(state: RootState) => selectUsersData(state) ?? initialState,
	);
