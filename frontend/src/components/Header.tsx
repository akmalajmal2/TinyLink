import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0">
      <nav className="flex justify-between items-center bg-cyan-900 px-3 pt-2 pb-4 text-gray-100">
        <Link to="/" className="font-semibold text-2xl ml-4">
          TinyLink
        </Link>
        <ul className="flex gap-6 items-center text-xl font-medium mr-3">
          <li>
            <Link to="/dashboard">DashBoard</Link>
          </li>
          <li>
            <Link to="/stats">Stats</Link>
          </li>
          <li>
            <Link to="/health">Health Check</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
