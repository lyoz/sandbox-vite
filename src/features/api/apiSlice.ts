import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../posts/postsSlice";

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi/" }),
	endpoints: (builder) => ({
		getPosts: builder.query<Post[], void>({
			query: () => "posts",
		}),
		getPost: builder.query<Post, string>({
			query: (postId) => `posts/${postId}`,
		}),
	}),
});

export const { useGetPostsQuery, useGetPostQuery } = apiSlice;