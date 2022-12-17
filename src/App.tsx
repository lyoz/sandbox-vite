import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import {
  ContactDetail,
  loader as contactDetailLoader,
} from "./routes/ContactDetail";
import { action as destroyContactAction } from "./routes/DestroyContact";
import {
  action as editContactAction,
  EditContact,
  loader as editContactLoader,
} from "./routes/EditContact";
import { Index } from "./routes/Index";
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
        index: true,
        element: <Index />,
      },
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
      {
        path: "contacts/:contactId/destroy",
        errorElement: <div>Oops! There was an error.</div>,
        action: destroyContactAction,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
