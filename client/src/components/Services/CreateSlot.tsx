import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import createAPIInstance from "../../utils/apiService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface CreateSlotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSlot: (topic: string, start_time: Date, endDate: Date, title: string) => void;
}

const CreateSlotPopup: React.FC<CreateSlotPopupProps> = ({
  isOpen,
  onClose,
  onCreateSlot,
}) => {
  const [topic, setTopic] = useState("");
  const [start_time, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state
  const [error, setError] = useState(""); // Define error state

  useEffect(() => {
    // Reset form fields when the popup opens
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTopic("Hello");
    setStartDate(null);
    setEndDate(null);
    setTitle("");
    setError(""); // Clear any errors
    setLoading(false); // Reset loading state
  };
  const token = useSelector((state: RootState) => state.auth.token);

  const handleCreateSlot = async () => {
    if (!topic || !start_time || !endDate || !title) {
      setError("All fields must be filled.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = '/api/mentorship/mentorshipslots'; // Adjust the URL based on your configuration
      const slotData = {
        topic,
        start_time: start_time.toISOString(), // Convert date to ISO string
        duration: Math.abs(start_time.getTime() - endDate.getTime()) / 36e5, // Calculate duration in hours
      };
      await createAPIInstance(token).post(endpoint, slotData);
      resetForm();
      onClose(); // Close the modal after successful creation
    } catch (error) {
      setError("Failed to create slot. Please try again.");
      console.error('Error creating slot:', error.response?.data || error.message);
    } finally {
      setLoading(false); // Ensure loading is set to false after the operation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-80 md:w-2/5">
        <div className="p-6 m-2">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Create Slot</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="m-2">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Enter title"
              />
            </div>
            <div className="flex">
              <DatePicker
                selected={start_time}
                placeholderText="Select Start Time"
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="input"
              />
              <DatePicker
                selected={endDate}
                placeholderText="Select End Time"
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="input"
              />
            </div>
            
          </div>
          <div className="flex justify-end">
            <button className="btn btn-gray mr-2" onClick={onClose}>Cancel</button>
            <button className="btn" onClick={handleCreateSlot} disabled={loading}>
              {loading ? 'Creating...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSlotPopup;
