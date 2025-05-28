import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScreenRecorder from "../components/ScreenRecorder";
import UploadedRecordings from "../components/UploadedRecording";
import { toast } from "sonner";

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
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-slate-100 via-white to-slate-100">
      {user ? (
        <>
          <motion.div
            className="flex justify-between items-center mb-8"
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold text-slate-800">
              Welcome, <span className="text-blue-600">{user.username}</span>
            </h1>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                toast.success("Logged out successfully.");
                navigate("/login");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
            >
              Logout
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">
                Product Tours
              </h2>
              <div className="space-y-4">
                <Link to="/editor">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow">
                    🎬 Create New Tour
                  </button>
                </Link>
                <br />
                <Link to="/tours">
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow">
                    📂 View My Tours
                  </button>
                </Link>
              </div>
            </div>

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ScreenRecorder />
              <div className="mt-4">
                <UploadedRecordings />
              </div>
            </motion.div>
          </motion.div>

          {recordings.length > 0 && (
            <motion.div
              className="mt-12"
              initial="hidden"
              animate="show"
              variants={fadeIn}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-slate-700 mb-6">
                My Recordings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recordings.map((recording) => (
                  <motion.div
                    key={recording._id}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.02 }}
                  >
                    <video
                      src={recording.url}
                      controls
                      className="w-full rounded-md mb-3"
                    />
                    <p className="text-sm text-gray-500 text-right">
                      📅 {new Date(recording.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
