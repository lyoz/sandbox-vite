import { apiSlice } from "../api/apiSlice";

export const reactionKeys = [
	"thumbsUp",
	"hooray",
	"heart",
	"rocket",
	"eyes",
] as const;

export type ReactionKey = (typeof reactionKeys)[number];

export type Post = {
	id: string;
	title: string;
	content: string;
	userId: string;
	reactionCounts: Record<ReactionKey, number>;
	createdAt: string;
};

export const extendedApiSlice = apiSlice.injectEndpoints({
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
					extendedApiSlice.util.updateQueryData(
						"getPosts",
						undefined,
						(draft) => {
							const post = draft.find((post) => post.id === postId);
							if (post != null) post.reactionCounts[reactionKey]++;
						},
					),
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
} = extendedApiSlice;
