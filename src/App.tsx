import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Navbar } from "./app/Navbar";

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
	},
]);

export const App = () => <RouterProvider router={router} />;
