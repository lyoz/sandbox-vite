import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../common/client";

export type Notification = {
	id: string;
	message: string;
	userId: string;
	createdAt: string;
	isNew?: boolean;
	hasBeenRead?: boolean;
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
	reducers: {
		allNotificationsRead: (state) => {
			state.forEach((notification) => {
				notification.hasBeenRead = true;
			});
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchNotifications.fulfilled, (state, action) => {
			for (const notification of state) {
				notification.isNew = !notification.hasBeenRead;
			}
			for (const notification of action.payload) {
				state.push({ ...notification, isNew: true });
			}
			state.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
		});
	},
});

export const { allNotificationsRead } = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
