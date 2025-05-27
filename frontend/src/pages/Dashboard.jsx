// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get("http://localhost:8080/api/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => setUser(res.data))
//       .catch((err) => {
//         localStorage.removeItem("token");
//         navigate("/login");
//       });
//   }, []);

//   return (
//     <div className="p-6">
//       {user ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>
//           <p className="text-gray-700">
//             You can now create interactive tours for your product.
//           </p>
//         </>
//       ) : (
//         <p>Loading user info...</p>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>
          <p className="text-gray-700 mb-6">
            You can now create interactive tours for your product.
          </p>

          <div className="space-x-4">
            <Link to="/editor">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Create New Tour
              </button>
            </Link>

            <Link to="/tours">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                View My Tours
              </button>
            </Link>
          </div>
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
