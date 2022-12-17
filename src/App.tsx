import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import {
  ContactDetail,
  loader as contactDetailLoader,
} from "./routes/ContactDetail";
import {
  action as rootAction,
  loader as rootLoader,
  Root,
} from "./routes/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <ContactDetail />,
        loader: contactDetailLoader,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
