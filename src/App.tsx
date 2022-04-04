import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

type CounterState = { value: number };
const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    },
    decrement: (state) => {
      state.value--;
    },
  },
});

const { increment, decrement } = counterSlice.actions;
const store = configureStore({ reducer: counterSlice.reducer });
type RootState = ReturnType<typeof store.getState>;
const useCounterSelector: TypedUseSelectorHook<RootState> = useSelector;
const useCounterDispatch = () => useDispatch<typeof store.dispatch>();

const Counter = () => {
  const count = useCounterSelector((state) => state.value);
  const dispatch = useCounterDispatch();
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      with redux-toolkit
      <Counter />
    </Provider>
  );
};

export default App;
