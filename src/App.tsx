import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);

export const App = () => <RouterProvider router={router} />;
