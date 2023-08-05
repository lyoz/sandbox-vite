import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../posts/postsSlice";

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi/" }),
	tagTypes: ["Post"],
	endpoints: (builder) => ({
		getPosts: builder.query<Post[], void>({
			query: () => "posts",
			providesTags: ["Post"],
		}),
		getPost: builder.query<Post, string>({
			query: (postId) => `posts/${postId}`,
		}),
		addNewPost: builder.mutation<
			Post,
			Omit<Post, "id" | "reactionCounts" | "createdAt">
		>({
			query: (initialPost) => ({
				url: "posts",
				method: "POST",
				body: initialPost,
			}),
			invalidatesTags: ["Post"],
		}),
		editPost: builder.mutation<
			Post,
			Omit<Post, "userId" | "reactionCounts" | "createdAt">
		>({
			query: (post) => ({
				url: `posts/${post.id}`,
				method: "PATCH",
				body: post,
			}),
		}),
	}),
});

export const {
	useGetPostsQuery,
	useGetPostQuery,
	useAddNewPostMutation,
	useEditPostMutation,
} = apiSlice;
