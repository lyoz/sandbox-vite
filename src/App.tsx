import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AddPostForm } from "./features/posts/AddPostForm";
import { PostsList } from "./features/posts/PostsList";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AddPostForm />
              <PostsList />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
