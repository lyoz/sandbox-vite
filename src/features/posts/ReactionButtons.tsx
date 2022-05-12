import { useAppDispatch } from "../../app/hooks";
import { Post, reactionAdded, ReactionKey } from "./postsSlice";

export const reactionEmoji = {
  "+1": "👍",
  "-1": "👎",
  hooray: "🎉",
  rocket: "🚀",
  eyes: "👀",
} as const;

export const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => (
    <button
      type="button"
      key={name}
      onClick={() =>
        dispatch(
          reactionAdded({ postId: post.id, reaction: name as ReactionKey })
        )
      }
    >
      {emoji} {post.reactions[name as ReactionKey]}
    </button>
  ));
  return <div>{reactionButtons}</div>;
};
