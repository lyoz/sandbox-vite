import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <Link to="/">Posts</Link>
      </section>
    </nav>
  );
};
