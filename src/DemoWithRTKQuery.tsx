import { configureStore } from "@reduxjs/toolkit";
import {
  createApi,
  fetchBaseQuery,
  setupListeners,
} from "@reduxjs/toolkit/query/react";
import { Provider } from "react-redux";

type QueryArgType = number;
type RawResponseType = { headers: { "User-Agent": string } };
type ResponseType = string;

// slice
const httpbinApi = createApi({
  reducerPath: "httpbinApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://httpbin.org" }),
  endpoints: (builder) => ({
    getDelay: builder.query<ResponseType, QueryArgType>({
      query: (second) => `delay/${second}`,
      transformResponse: (raw: RawResponseType) => raw.headers["User-Agent"],
    }),
  }),
});

// store
const store = configureStore({
  reducer: {
    [httpbinApi.reducerPath]: httpbinApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(httpbinApi.middleware),
});

setupListeners(store.dispatch);

const App = () => {
  const [trigger, { data, isFetching, error }] =
    httpbinApi.useLazyGetDelayQuery();
  const label = error ? (
    <>error</>
  ) : isFetching ? (
    <>fetching...</>
  ) : data ? (
    <>{data}</>
  ) : (
    <>no data</>
  );
  return (
    <>
      <div>{label}</div>
      <button onClick={() => trigger(1)}>fetch</button>
    </>
  );
};

const DemoWithRTKQuery = () => {
  return (
    <Provider store={store}>
      <h2>Demo with RTK Query</h2>
      <App />
    </Provider>
  );
};
export default DemoWithRTKQuery;
