import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    return user && user.role === "VENDOR" ? "/vendor/dashboard" : "/spaces";
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-8">
      <div className="flex-1">
        <Link
          to={getDashboardPath()}
          className="btn btn-ghost text-xl font-bold"
        >
          {"Bridge Hub"}
        </Link>
      </div>
      <div className="flex-none gap-2">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xs uppercase">
                  {user && user.name ? user.name[0] : "U"}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="menu-title px-4 py-2">
                <span className="font-semibold text-base-content">
                  {user && user.name ? user.name : "User"}
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  {user && user.email ? user.email : ""}
                </span>
                <span className="badge badge-sm badge-outline mt-1">
                  {user && user.role ? user.role : "GUEST"}
                </span>
              </li>
              <div className="divider my-0"></div>
              {user && user.role === "VENDOR" && (
                <li>
                  <Link to="/vendor/dashboard">{"Dashboard Vendor"}</Link>
                </li>
              )}
              <li>
                <Link to="/spaces">{"Katalog Spaces"}</Link>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-error"
                >
                  {"Logout"}
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">
              {"Masuk"}
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              {"Daftar"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
