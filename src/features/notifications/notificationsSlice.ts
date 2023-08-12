import {
	AnyAction,
	EntityState,
	ThunkAction,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
	createSlice,
} from "@reduxjs/toolkit";
import { subMinutes } from "date-fns";
import { RootState } from "../../app/store";
import { client } from "../../common/client";
import { forceGenerateNotifications } from "../../mocks/socketServer";
import { apiSlice } from "../api/apiSlice";

export type Notification = {
	id: string;
	message: string;
	userId: string;
	createdAt: string;
	isNew?: boolean;
	hasBeenRead?: boolean;
};

const isNotification = (x: unknown): x is Notification => {
	if (!(x != null && typeof x === "object")) return false;
	if (!("id" in x && typeof x.id === "string")) return false;
	if (!("message" in x && typeof x.message === "string")) return false;
	if (!("userId" in x && typeof x.userId === "string")) return false;
	if (!("createdAt" in x && typeof x.createdAt === "string")) return false;
	if (!(!("isNew" in x) || typeof x.isNew === "boolean")) return false;
	if (!(!("hasBeenRead" in x) || typeof x.id === "boolean")) return false;
	return true;
};

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query<Notification[], void>({
			query: () => "notifications",
			onCacheEntryAdded: async (
				_,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved },
			) => {
				const ws = new WebSocket("ws://localhost");
				try {
					await cacheDataLoaded;
					ws.addEventListener("message", (event) => {
						if (typeof event.data !== "string") return;
						const data: unknown = JSON.parse(event.data);
						if (!(data != null && typeof data === "object")) return;
						if (!("type" in data && "payload" in data)) return;
						const { type, payload } = data;
						if (
							type === "notifications" &&
							Array.isArray(payload) &&
							payload.every(isNotification)
						) {
							updateCachedData((draft) => {
								for (const notification of payload) {
									draft.push(notification);
									draft.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
								}
							});
						}
					});
				} catch {
					// no-op
				}
				await cacheEntryRemoved;
				ws.close();
			},
		}),
	}),
});

export const { useGetNotificationsQuery } = extendedApiSlice;

export const selectNotificationsResult =
	extendedApiSlice.endpoints.getNotifications.select();

const selectNotificationsData = createSelector(
	selectNotificationsResult,
	(notificationsResult) => notificationsResult.data,
);

export const fetchNotificationsWebSocket =
	(): ThunkAction<void, RootState, unknown, AnyAction> => (_, getState) => {
		const allNotifications = selectNotificationsData(getState());
		const latestTimestamp =
			allNotifications?.[0]?.createdAt ??
			subMinutes(new Date(), 15).toISOString();
		forceGenerateNotifications(latestTimestamp);
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
