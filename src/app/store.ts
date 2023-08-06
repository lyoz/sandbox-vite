import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import { notificationsReducer } from "../features/notifications/notificationsSlice";
import { postsReducer } from "../features/posts/postsSlice";

export const store = configureStore({
	reducer: {
		posts: postsReducer,
		notifications: notificationsReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
