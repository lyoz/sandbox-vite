import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { addNewPost } from "./postsSlice";

export const AddPostForm = () => {
	const dispatch = useAppDispatch();
	const users = useAppSelector(selectAllUsers);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [userId, setUserId] = useState("");
	const [addRequestStatus, setAddRequestStatus] = useState("idle");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setContent(e.currentTarget.value);

	const handleAuthorChange = (e: ChangeEvent<HTMLSelectElement>) =>
		setUserId(e.currentTarget.value);

	const canSave =
		title !== "" &&
		content !== "" &&
		userId !== "" &&
		addRequestStatus === "idle";

	const handleSave = async () => {
		if (canSave) {
			try {
				setAddRequestStatus("pending");
				await dispatch(addNewPost({ title, content, userId })).unwrap();
				setTitle("");
				setContent("");
				setUserId("");
			} catch (err) {
				console.error("Failed to save the post:", err);
			} finally {
				setAddRequestStatus("idle");
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
