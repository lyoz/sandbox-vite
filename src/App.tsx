import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import {
  ContactDetail,
  loader as contactDetailLoader,
} from "./routes/ContactDetail";
import {
  action as editContactAction,
  EditContact,
  loader as editContactLoader,
} from "./routes/EditContact";
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
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: editContactLoader,
        action: editContactAction,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
