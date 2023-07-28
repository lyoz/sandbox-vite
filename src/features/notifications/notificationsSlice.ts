import {
	EntityState,
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
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

const notificationsAdapter = createEntityAdapter<Notification>({
	sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

type NotificationsState = EntityState<Notification>;

const initialState: NotificationsState = notificationsAdapter.getInitialState();

export const fetchNotifications = createAsyncThunk<
	Notification[],
	void,
	{ state: RootState }
>("notifications/fetchNotifications", async (_, { getState }) => {
	const [latestNotification] = selectAllNotifications(getState());
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
			for (const notification of Object.values(state.entities)) {
				if (notification == null) continue; // NOTE: unnecessary in RTK 2.0
				notification.hasBeenRead = true;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchNotifications.fulfilled, (state, action) => {
			for (const notification of Object.values(state.entities)) {
				if (notification == null) continue; // NOTE: unnecessary in RTK 2.0
				notification.isNew = !notification.hasBeenRead;
			}
			notificationsAdapter.addMany(
				state,
				action.payload.map((notification) => ({
					...notification,
					isNew: true,
				})),
			);
		});
	},
});

export const { allNotificationsRead } = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;

export const { selectAll: selectAllNotifications } =
	notificationsAdapter.getSelectors((state: RootState) => state.notifications);
