import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../posts/postsSlice";
import { User } from "../users/usersSlice";

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi/" }),
	tagTypes: ["Post"],
	endpoints: (builder) => ({
		getPosts: builder.query<Post[], void>({
			query: () => "posts",
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: "Post" as const, id })),
				{ type: "Post", id: "LIST" },
			],
		}),
		getPost: builder.query<Post, string>({
			query: (postId) => `posts/${postId}`,
			providesTags: (_result, _error, arg) => [{ type: "Post", id: arg }],
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
			invalidatesTags: [{ type: "Post", id: "LIST" }],
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
			invalidatesTags: (_result, _error, arg) => [{ type: "Post", id: arg.id }],
		}),
		getUsers: builder.query<User[], void>({
			query: () => "users",
		}),
	}),
});

export const {
	useGetPostsQuery,
	useGetPostQuery,
	useAddNewPostMutation,
	useEditPostMutation,
} = apiSlice;
