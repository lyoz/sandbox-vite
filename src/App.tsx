import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./app/Navbar";
import { AddPostForm } from "./features/posts/AddPostForm";
import { PostsList } from "./features/posts/PostsList";
import { SinglePostPage } from "./features/SinglePostPage";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path=""
          element={
            <>
              <AddPostForm />
              <PostsList />
            </>
          }
        />
        <Route path="posts/:postId" element={<SinglePostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
