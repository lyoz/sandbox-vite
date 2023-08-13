import {
	AnyAction,
	EntityState,
	ThunkAction,
	createAction,
	createEntityAdapter,
	createSelector,
	createSlice,
	isAnyOf,
} from "@reduxjs/toolkit";
import { subMinutes } from "date-fns";
import { RootState } from "../../app/store";
import { forceGenerateNotifications } from "../../mocks/socketServer";
import { apiSlice } from "../api/apiSlice";

export type Notification = {
	id: string;
	message: string;
	userId: string;
	createdAt: string;
};

const isNotification = (x: unknown): x is Notification => {
	if (!(x != null && typeof x === "object")) return false;
	if (!("id" in x && typeof x.id === "string")) return false;
	if (!("message" in x && typeof x.message === "string")) return false;
	if (!("userId" in x && typeof x.userId === "string")) return false;
	if (!("createdAt" in x && typeof x.createdAt === "string")) return false;
	return true;
};

const notificationsReceived = createAction<Notification[]>(
	"notifications/notificationsReceived",
);

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query<Notification[], void>({
			query: () => "notifications",
			onCacheEntryAdded: async (
				_,
				{ dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved },
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
							dispatch(notificationsReceived(payload));
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

const matchNotificationsReceived = isAnyOf(
	notificationsReceived,
	extendedApiSlice.endpoints.getNotifications.matchFulfilled,
);

export type NotificationMeta = {
	id: string;
	isNew?: boolean;
	hasBeenRead?: boolean;
};

const notificationsAdapter = createEntityAdapter<NotificationMeta>();

type NotificationsState = EntityState<NotificationMeta>;

const initialState: NotificationsState = notificationsAdapter.getInitialState();

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
		builder.addMatcher(matchNotificationsReceived, (state, action) => {
			for (const notification of Object.values(state.entities)) {
				if (notification == null) continue; // NOTE: unnecessary in RTK 2.0
				notification.isNew = !notification.hasBeenRead;
			}
			notificationsAdapter.addMany(
				state,
				action.payload.map((notification) => ({
					id: notification.id,
					isNew: true,
				})) satisfies NotificationMeta[],
			);
		});
	},
});

export const { allNotificationsRead } = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;

export const {
	selectEntities: selectNotificationMetaEntities,
	selectAll: selectAllNotificationMetas,
} = notificationsAdapter.getSelectors(
	(state: RootState) => state.notifications,
);
