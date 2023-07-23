import { Link } from "react-router-dom";

export const Navbar = () => (
	<nav>
		<section>
			<h1>Redux Essentials Example</h1>
			<div style={{ display: "flex", columnGap: 8 }}>
				<Link to="/">Posts</Link>
				<Link to="/users">Users</Link>
			</div>
		</section>
	</nav>
);
