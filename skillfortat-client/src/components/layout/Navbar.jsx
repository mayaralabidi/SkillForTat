import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        SkillForTat
      </Link>

      <nav className="nav-links">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/offers/new" className={linkClass}>
          Create Offer
        </NavLink>
        <NavLink to="/matches" className={linkClass}>
          Matches
        </NavLink>
      </nav>

      <div className="nav-user">
        <span className="nav-username">{user?.username || "Member"}</span>
        <button
          type="button"
          className="button button-ghost"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
