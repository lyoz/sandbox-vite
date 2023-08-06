import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./app/store";
import { extendedApiSlice } from "./features/users/usersSlice";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

if (process.env.NODE_ENV === "development") {
	const { worker } = await import("./mocks/browser");
	worker.start({ onUnhandledRequest: "bypass" });
}

store.dispatch(extendedApiSlice.endpoints.getUsers.initiate());

const root = createRoot(container);
root.render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
);
