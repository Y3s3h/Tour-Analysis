import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function UploadedRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecordings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://tour-analysis.onrender.com/api/recordings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // The url from backend should be the complete URL
      setRecordings(res.data.recordings);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch recordings:", err);
      toast.error("Error fetching recordings");
      setLoading(false);
    }
  };

  const deleteRecording = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://tour-analysis.onrender.com/api/recordings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecordings((prev) => prev.filter((rec) => rec._id !== id));
    } catch (err) {
      console.error("Failed to delete recording:", err);
      toast.error("Error deleting recording");
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  if (loading) {
    return <div>Loading recordings...</div>;
  }

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Uploaded Recordings</h2>
      {recordings.length === 0 ? (
        <p>No recordings uploaded yet.</p>
      ) : (
        <div className="space-y-6">
          {recordings.map((rec) => (
            <div key={rec._id} className="space-y-2">
              {/* <video
                controls
                src={rec.url} // Use the complete URL from backend
                className="max-w-full"
              /> */}
              <video
                controls
                muted
                autoplay
                loop
                width="100%"
                className="rounded shadow"
                preload="metadata"
              >
                <source
                  src={rec.url.replace(".webm", ".webm")}
                  type="video/webm"
                />
                <source
                  src={rec.url.replace(".webm", ".mp4")}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteRecording(rec._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
