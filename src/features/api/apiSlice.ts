import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post, ReactionKey } from "../posts/postsSlice";

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
		addReaction: builder.mutation<
			Post,
			{ postId: string; reactionKey: ReactionKey }
		>({
			query: ({ postId, reactionKey }) => ({
				url: `posts/${postId}/reactions`,
				method: "POST",
				body: { reactionKey },
			}),
			onQueryStarted: async (
				{ postId, reactionKey },
				{ dispatch, queryFulfilled },
			) => {
				const patchResult = dispatch(
					apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
						const post = draft.find((post) => post.id === postId);
						if (post != null) post.reactionCounts[reactionKey]++;
					}),
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
		}),
	}),
});

export const {
	useGetPostsQuery,
	useGetPostQuery,
	useAddNewPostMutation,
	useEditPostMutation,
	useAddReactionMutation,
} = apiSlice;
