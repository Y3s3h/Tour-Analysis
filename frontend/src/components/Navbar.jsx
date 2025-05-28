import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-md bg-white/10 border border-white/20 shadow-md text-white px-6 py-4 rounded-xl m-4 flex justify-between items-center">
      <Link
        to="/home"
        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        TourBuilder
      </Link>

      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className=" text-blue-500 hover:text-cyan-300 transition duration-200"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-1 rounded-lg shadow-md transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white px-4 py-1 rounded-lg shadow-md transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-4 py-1 rounded-lg shadow-md transition duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
