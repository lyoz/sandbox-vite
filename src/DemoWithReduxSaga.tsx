import { applyMiddleware, createStore, Reducer } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";

type QueryArgType = number;
type RawResponseType = { headers: { "User-Agent": string } };
type ResponseType = string;

// actions
const FETCH_HTTPBIN = {
  REQUEST: "FETCH_HTTPBIN.REQUEST",
  SUCCESS: "FETCH_HTTPBIN.SUCCESS",
  FAILURE: "FETCH_HTTPBIN.FAILURE",
} as const;
const fetchHttpBinRequest = (second: QueryArgType) => ({
  type: FETCH_HTTPBIN.REQUEST,
  second,
});
const fetchHttpBinSuccess = (data: ResponseType) => ({
  type: FETCH_HTTPBIN.SUCCESS,
  data,
});
const fetchHttpBinFailure = () => ({ type: FETCH_HTTPBIN.FAILURE });

type FetchHttpBinAction =
  | ReturnType<typeof fetchHttpBinRequest>
  | ReturnType<typeof fetchHttpBinSuccess>
  | ReturnType<typeof fetchHttpBinFailure>;

// saga
function* workFetchHttpBin(action: ReturnType<typeof fetchHttpBinRequest>) {
  try {
    const raw: RawResponseType = yield fetch(
      `https://httpbin.org/delay/${action.second}`
    ).then((res) => res.json());
    yield put({
      type: FETCH_HTTPBIN.SUCCESS,
      data: raw.headers["User-Agent"],
    });
  } catch (e) {
    yield put({ type: FETCH_HTTPBIN.FAILURE });
  }
}
function* watchFetchHttpBin() {
  yield takeEvery(FETCH_HTTPBIN.REQUEST, workFetchHttpBin);
}
function* rootSaga() {
  yield all([call(watchFetchHttpBin)]);
}

type RootAction = FetchHttpBinAction;
type RootState = { data: string };

// initial state
const initialState: RootState = { data: "no data" };
const sagaMiddleware = createSagaMiddleware();

// reducer
const rootReducer: Reducer<RootState, RootAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case FETCH_HTTPBIN.REQUEST:
      return { ...state, data: "fetching..." };
    case FETCH_HTTPBIN.SUCCESS:
      return { ...state, data: action.data };
    case FETCH_HTTPBIN.FAILURE:
      return { ...state, data: "error" };
    default:
      return state;
  }
};

// store
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

const App = () => {
  const value = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch<typeof store.dispatch>();
  return (
    <>
      <div>{value}</div>
      <button
        onClick={() => dispatch({ type: FETCH_HTTPBIN.REQUEST, second: 1 })}
      >
        fetch
      </button>
    </>
  );
};

const DemoWithReduxSaga = () => {
  return (
    <Provider store={store}>
      <h2>Demo with Redux Saga</h2>
      <App />
    </Provider>
  );
};

export default DemoWithReduxSaga;
