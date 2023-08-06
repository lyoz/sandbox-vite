import { useAddReactionMutation } from "../api/apiSlice";
import { Post, ReactionKey, reactionKeys } from "./postsSlice";

const reactionEmojis = {
	thumbsUp: "👍",
	hooray: "🎉",
	heart: "❤️",
	rocket: "🚀",
	eyes: "👀",
} as const satisfies Record<ReactionKey, string>;

export const ReactionButtons = ({ post }: { post: Post }) => {
	const [addReaction] = useAddReactionMutation();

	const handleReactionAdd = (reactionKey: ReactionKey) => {
		addReaction({ postId: post.id, reactionKey });
	};

	return (
		<div style={{ display: "flex", columnGap: 8 }}>
			{reactionKeys.map((key) => (
				<button key={key} onClick={() => handleReactionAdd(key)}>
					{reactionEmojis[key]} {post.reactionCounts[key]}
				</button>
			))}
		</div>
	);
};
