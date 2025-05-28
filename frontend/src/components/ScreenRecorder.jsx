import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error("Failed to start recording: " + err.message);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const uploadRecording = async () => {
    if (!recordedBlob) return;

    const formData = new FormData();
    formData.append("video", recordedBlob, "screen-recording.webm");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://tour-analysis.onrender.com/api/recordings/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Recording uploaded successfully!");
      setRecordedBlob(null);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload recording: " + err.message);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Screen Recorder</h2>
      <div className="space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Stop Recording
          </button>
        )}

        {recordedBlob && (
          <div className="mt-4">
            <video
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="mb-4 max-w-full"
            />
            <button
              onClick={uploadRecording}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Upload Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
