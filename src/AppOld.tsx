import { connect, ConnectedProps, Provider } from "react-redux";
import { createStore, Reducer } from "@reduxjs/toolkit";

type CounterState = { value: number };
const initialState: CounterState = { value: 0 };

const increment = () => ({ type: "INCREMENT" } as const);
const decrement = () => ({ type: "DECREMENT" } as const);
type CounterAction =
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>;

const counterReducer: Reducer<CounterState, CounterAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, value: state.value + 1 };
    case "DECREMENT":
      return { ...state, value: state.value + 1 };
    default:
      return state;
  }
};

const store = createStore(counterReducer);

const mapStateToProps = (state: CounterState) => ({ value: state.value });
const mapDispatchToProps = { increment, decrement };
const connector = connect(mapStateToProps, mapDispatchToProps);
type CounterProps = ConnectedProps<typeof connector>;

const CounterInner = (props: CounterProps) => {
  const count = props.value;
  const { increment, decrement } = props;
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => increment()}>increment</button>
      <button onClick={() => decrement()}>decrement</button>
    </div>
  );
};
const Counter = connector(CounterInner);

const AppOld = () => {
  return (
    <Provider store={store}>
      without redux-toolkit
      <Counter />
    </Provider>
  );
};

export default AppOld;
