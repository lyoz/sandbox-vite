import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { ContactDetail } from "./routes/ContactDetail";
import { loader as rootLoader, Root } from "./routes/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "contacts/:contactId",
        element: <ContactDetail />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
