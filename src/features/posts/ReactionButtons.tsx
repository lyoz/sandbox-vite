import { useAppDispatch } from "../../app/hooks";
import { Post, ReactionKey, reactionAdded, reactionKeys } from "./postsSlice";

const reactionEmojis = {
	thumbsUp: "👍",
	hooray: "🎉",
	heart: "❤️",
	rocket: "🚀",
	eyes: "👀",
} as const satisfies Record<ReactionKey, string>;

export const ReactionButtons = ({ post }: { post: Post }) => {
	const dispatch = useAppDispatch();

	const handleReactionAdd = (reactionKey: ReactionKey) => {
		dispatch(reactionAdded({ postId: post.id, reactionKey }));
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
