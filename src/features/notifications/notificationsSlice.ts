import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../common/client";

export type Notification = {
	id: string;
	message: string;
	userId: string;
	createdAt: string;
};

type NotificationsState = Notification[];

const initialState: NotificationsState = [];

export const fetchNotifications = createAsyncThunk<
	Notification[],
	void,
	{ state: RootState }
>("notifications/fetchNotifications", async (_, { getState }) => {
	const [latestNotification] = getState().notifications;
	const latestTimestamp = latestNotification?.createdAt ?? "";
	const response = await client.get(
		`/fakeApi/notifications?since=${latestTimestamp}`,
	);
	return response.data;
});

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchNotifications.fulfilled, (state, action) => {
			return [...state, ...action.payload].sort((a, b) =>
				b.createdAt.localeCompare(a.createdAt),
			);
		});
	},
});

export const notificationsReducer = notificationsSlice.reducer;
