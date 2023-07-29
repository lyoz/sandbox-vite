import { ChangeEvent, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { useAddNewPostMutation } from "../api/apiSlice";
import { selectAllUsers } from "../users/usersSlice";

export const AddPostForm = () => {
	const users = useAppSelector(selectAllUsers);
	const [addNewPost, { isLoading }] = useAddNewPostMutation();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [userId, setUserId] = useState("");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setContent(e.currentTarget.value);

	const handleAuthorChange = (e: ChangeEvent<HTMLSelectElement>) =>
		setUserId(e.currentTarget.value);

	const canSave = title !== "" && content !== "" && userId !== "" && !isLoading;

	const handleSave = async () => {
		if (canSave) {
			try {
				await addNewPost({ title, content, userId }).unwrap();
				setTitle("");
				setContent("");
				setUserId("");
			} catch (err) {
				console.error("Failed to save the post:", err);
			}
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
					Author:
					<select value={userId} onChange={handleAuthorChange}>
						<option value="" />
						{users.map((user) => (
							<option key={user.id} value={user.id}>
								{user.name}
							</option>
						))}
					</select>
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
