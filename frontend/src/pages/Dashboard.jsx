// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

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

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="p-6">
//       {user ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>
//           <p className="text-gray-700 mb-6">
//             You can now create interactive tours for your product.
//           </p>

//           <div className="space-x-4">
//             <Link to="/editor">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded">
//                 Create New Tour
//               </button>
//             </Link>

//             <Link to="/tours">
//               <button className="bg-green-600 text-white px-4 py-2 rounded">
//                 View My Tours
//               </button>
//             </Link>
//           </div>
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
import ScreenRecorder from "../components/ScreenRecorder";
import UploadedRecordings from "../components/UploadedRecording";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [userRes, recordingsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/api/recordings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setRecordings(recordingsRes.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="p-6">
      {user ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Product Tours</h2>
              <div className="space-y-4">
                <Link to="/editor">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create New Tour
                  </button>
                </Link>
                <Link to="/tours">
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    View My Tours
                  </button>
                </Link>
              </div>
            </div>

            <div>
              <ScreenRecorder />
              <UploadedRecordings />
            </div>
          </div>

          {recordings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">My Recordings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recordings.map((recording) => (
                  <div
                    key={recording._id}
                    className="border rounded-lg p-4 shadow"
                  >
                    <video
                      src={recording.url}
                      controls
                      className="w-full mb-2"
                    />
                    <p className="text-sm text-gray-600">
                      Recorded:{" "}
                      {new Date(recording.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
