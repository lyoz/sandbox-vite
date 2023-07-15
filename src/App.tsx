import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Navbar } from "./app/Navbar";
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
				element: <PostsList />,
			},
		],
	},
]);

export const App = () => <RouterProvider router={router} />;
