import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://tour-analysis.onrender.com/api/tours",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Check if response.data.tours exists, otherwise use response.data
        setTours(response.data.tours || response.data || []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setError(error.response?.data?.msg || error.message);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleViewTour = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  if (loading) return <div className="p-6">Loading tours...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tours</h1>
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Tour
        </button>
      </div>

      {tours.length === 0 ? (
        <p className="text-gray-600">
          No tours created yet. Create your first tour!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg"
            >
              <img
                src={tour.imageUrl}
                alt="Tour screenshot"
                className="w-full h-48 object-cover rounded mb-2"
              />
              <div className="font-bold mb-2">Steps: {tour.steps.length}</div>
              <div className="text-sm text-gray-600 mb-2">
                Created: {new Date(tour.createdAt).toLocaleDateString()}
              </div>
              <button
                className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleViewTour(tour._id)}
              >
                View Tour
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
