import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Navbar } from "./app/Navbar";
import { AddPostForm } from "./features/posts/AddPostForm";
import { PostsList } from "./features/posts/PostsList";

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
		],
	},
]);

export const App = () => <RouterProvider router={router} />;
