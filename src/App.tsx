import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Navbar } from "./app/Navbar";
import { AddPostForm } from "./features/posts/AddPostForm";
import { EditPostForm } from "./features/posts/EditPostForm";
import { PostsList } from "./features/posts/PostsList";
import { SinglePostPage } from "./features/posts/SinglePostPage";
import { UserPage } from "./features/users/UserPage";
import { UsersList } from "./features/users/UsersList";

const Layout = () => (
	<>
		<Navbar />
		<Outlet />
	</>
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: (
					<>
						<AddPostForm />
						<PostsList />
					</>
				),
			},
			{
				path: "posts/:postId",
				element: <SinglePostPage />,
			},
			{
				path: "editPost/:postId",
				element: <EditPostForm />,
			},
			{
				path: "users",
				element: <UsersList />,
			},
			{
				path: "users/:userId",
				element: <UserPage />,
			},
		],
	},
]);

export const App = () => <RouterProvider router={router} />;
