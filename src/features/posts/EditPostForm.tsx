import { ChangeEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { assertIsDefined } from "../../common/assertIsDefined";
import { Post, postUpdated, selectPostById } from "./postsSlice";

const EditPostFormInner = ({ post }: { post: Post }) => {
	const dispatch = useAppDispatch();
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const navigate = useNavigate();

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setContent(e.currentTarget.value);

	const canSave = title !== "" && content !== "";

	const handleSave = () => {
		if (canSave) {
			dispatch(postUpdated({ id: post.id, title, content }));
			navigate(`/posts/${post.id}`);
		}
	};

	return (
		<section>
			<h2>Edit Post</h2>
			<form>
				<label>
					Post Title:
					<input value={title} onChange={handleTitleChange} />
				</label>
				<label>
					Content:
					<textarea value={content} onChange={handleContentChange} />
				</label>
				<button type="button" onClick={handleSave} disabled={!canSave}>
					Save Post
				</button>
			</form>
		</section>
	);
};

export const EditPostForm = () => {
	const { postId } = useParams();
	assertIsDefined(postId);
	const post = useAppSelector((state) => selectPostById(state, postId));

	if (post == null) {
		return (
			<section>
				<h2>Post not found!</h2>
			</section>
		);
	}

	return <EditPostFormInner post={post} />;
};
