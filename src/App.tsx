import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Hello, Vite + React + TypeScript!</p>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  );
};

export default App;
