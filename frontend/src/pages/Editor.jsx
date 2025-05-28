import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { X } from "lucide-react"; // for remove icon

export default function Editor() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [stepText, setStepText] = useState("");
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleAddStep = () => {
    if (!stepText.trim()) return;
    setSteps([...steps, { id: crypto.randomUUID(), text: stepText }]);
    setStepText("");
  };

  const handleRemoveStep = (id) => {
    setSteps(steps.filter((s) => s.id !== id));
  };
  const handleSaveTour = async () => {
    if (!imageFile || steps.length === 0) {
      toast.error("Please upload an image and add steps.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append(
      "steps",
      JSON.stringify(
        steps.map((step, index) => ({
          title: `Step ${index + 1}`,
          description: step.text,
          position: { top: (index + 1) * 30, left: 20 },
        }))
      )
    );

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/tours",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Tour saved successfully!");
        navigate("/tours");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        "Failed to save tour: " + (err.response?.data?.msg || err.message)
      );
    }
  };
  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛠️ Create Your Product Tour
      </h1>

      {/* Upload */}
      <div className="bg-white p-6 shadow rounded-lg mb-6 border">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Upload a Screenshot:
        </label>
        <button className=" px-3 py-3 rounded-md bg-gradient-to-r gap-3 from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 transition-all text-black font-semibold shadow-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
        </button>
      </div>

      {/* Step Input */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Describe this step..."
          value={stepText}
          onChange={(e) => setStepText(e.target.value)}
          className="input input-bordered border-gray-100 flex-1"
        />
        <button
          onClick={handleAddStep}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Add Step
        </button>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="relative border rounded-lg overflow-hidden mb-6 shadow-md">
          <img src={image} alt="Preview" className="w-full" />
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="absolute bg-yellow-300 text-sm font-medium px-2 py-1 rounded-full shadow hover:scale-105 transition"
              style={{
                top: `${(idx + 1) * 30}px`,
                left: "20px",
              }}
            >
              {`Step ${idx + 1}`}
            </div>
          ))}
        </div>
      )}

      {/* Step List */}
      {steps.length > 0 && (
        <div className="bg-white p-4 shadow rounded-lg mb-6 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">📋 Steps</h2>
          <ul className="space-y-3">
            {steps.map((step, idx) => (
              <li
                key={step.id}
                className="flex items-center justify-between bg-gray-100 p-3 rounded shadow-sm"
              >
                <span className="text-gray-700 font-medium">
                  {`Step ${idx + 1}: ${step.text}`}
                </span>
                <button
                  onClick={() => handleRemoveStep(step.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSaveTour}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow-md text-lg"
        >
          💾 Save Tour
        </button>
      </div>
    </div>
  );
}
