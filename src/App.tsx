import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PostsList } from "./features/posts/PostsList";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostsList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
