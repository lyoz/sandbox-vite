import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { postAdded } from "./postsSlice";

export const AddPostForm = () => {
	const dispatch = useAppDispatch();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setContent(e.currentTarget.value);

	const canSave = title !== "" && content !== "";

	const handleSave = () => {
		if (canSave) {
			dispatch(postAdded(title, content));
			setTitle("");
			setContent("");
		}
	};

	return (
		<section>
			<h2>Add a New Post</h2>
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
