import { ChangeEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assertIsDefined } from "../../common/assertIsDefined";
import { useEditPostMutation, useGetPostQuery } from "../posts/postsSlice";
import { Post } from "./postsSlice";

const EditPostFormInner = ({ post }: { post: Post }) => {
	const [updatePost, { isLoading }] = useEditPostMutation();
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const navigate = useNavigate();

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setContent(e.currentTarget.value);

	const canSave = title !== "" && content !== "" && !isLoading;

	const handleSave = async () => {
		if (canSave) {
			await updatePost({ id: post.id, title, content });
			navigate(`/posts/${post.id}`);
		}
	};

	return (
		<section>
			<h2>Edit Post</h2>
			<form>
				<label>
					Post Title:
					<input
						value={title}
						onChange={handleTitleChange}
						disabled={isLoading}
					/>
				</label>
				<label>
					Content:
					<textarea
						value={content}
						onChange={handleContentChange}
						disabled={isLoading}
					/>
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
	const { data: post } = useGetPostQuery(postId);

	if (post == null) {
		return (
			<section>
				<h2>Post not found!</h2>
			</section>
		);
	}

	return <EditPostFormInner post={post} />;
};
