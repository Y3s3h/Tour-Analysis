import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Editor() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // store actual file
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
    setSteps([...steps, { id: steps.length + 1, text: stepText }]);
    setStepText("");
  };

  const handleRemoveStep = (id) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleSaveTour = async () => {
    if (!imageFile || steps.length === 0) {
      alert("Please upload an image and add steps.");
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
          position: { top: (index + 1) * 20, left: 20 },
        }))
      )
    );

    try {
      const token = localStorage.getItem("token"); // or however you store JWT

      const res = await axios.post(
        "http://localhost:8080/api/tours",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Tour saved successfully!");
      navigate("/tours");
    } catch (err) {
      console.error(err);
      alert("Failed to save tour.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Product Tour</h1>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block mb-2">Upload Screenshot:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Step Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter step description..."
          value={stepText}
          onChange={(e) => setStepText(e.target.value)}
          className="input flex-1"
        />
        <button
          onClick={handleAddStep}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Step
        </button>
      </div>

      {/* Preview Image */}
      {image && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Preview Screenshot</h2>
          <div className="relative border rounded">
            <img src={image} alt="Uploaded" className="max-w-full rounded" />
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="absolute bg-yellow-300 text-black text-xs rounded shadow"
                style={{
                  top: `${(idx + 1) * 20}px`,
                  left: "20px",
                  position: "absolute",
                  padding: "4px",
                }}
              >
                Step {idx + 1}: {step.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step List */}
      {steps.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">All Steps</h2>
          <ul className="list-disc pl-6">
            {steps.map((step) => (
              <li key={step.id} className="mb-1">
                {step.text}
                <button
                  onClick={() => handleRemoveStep(step.id)}
                  className="ml-2 text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Save Tour Button */}
      <button
        onClick={handleSaveTour}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Save Tour
      </button>
    </div>
  );
}
