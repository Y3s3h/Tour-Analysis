import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TourView() {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://tour-analysis.onrender.com/api/tours/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTour(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) return <div className="p-6">Loading tour...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!tour) return <div className="p-6">Tour not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tour View</h1>
        <button
          onClick={() => navigate("/tours")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Tours
        </button>
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        <img
          src={tour.imageUrl}
          alt="Tour screenshot"
          className="w-full rounded"
        />
        {tour.steps.map((step, idx) => (
          <div
            key={idx}
            className="absolute bg-yellow-300 text-black text-xs rounded shadow p-2"
            style={{
              top: `${step.position.top}px`,
              left: `${step.position.left}px`,
            }}
          >
            {step.title}: {step.description}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Tour Steps</h2>
        <ol className="list-decimal pl-6">
          {tour.steps.map((step, idx) => (
            <li key={idx} className="mb-2">
              <span className="font-bold">{step.title}:</span>{" "}
              {step.description}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
