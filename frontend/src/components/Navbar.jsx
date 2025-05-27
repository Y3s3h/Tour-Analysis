// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="p-4 bg-gray-900 text-white flex justify-between">
//       <Link to="/" className="font-bold text-xl">
//         TourBuilder
//       </Link>
//       <div className="space-x-4">
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/login">Login</Link>
//         <Link to="/register">Register</Link>
//       </div>
//     </nav>
//   );
// }
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">
        TourBuilder
      </Link>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
