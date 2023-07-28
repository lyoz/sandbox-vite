import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../posts/postsSlice";

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi/" }),
	endpoints: (builder) => ({
		getPosts: builder.query<Post[], void>({
			query: () => "posts",
		}),
	}),
});

export const { useGetPostsQuery } = apiSlice;
