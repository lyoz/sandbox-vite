import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { ContactDetail } from "./routes/ContactDetail";
import { Root } from "./routes/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:contactId",
        element: <ContactDetail />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
