import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Slot } from "../Services/fetch";
import createAPIInstance from "../../utils/apiService";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface EditSlotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSlot: (id: number, topic: string, start_time: Date, end_time: Date, title: string) => void;
  slotData: Slot;
}

const EditSlotPopup: React.FC<EditSlotPopupProps> = ({ isOpen, onClose, onUpdateSlot, slotData }) => {
  const [topic, setTopic] = useState(slotData.topic);
  const [startDate, setStartDate] = useState<Date | null>(new Date(slotData.startTime));
  const [endDate, setEndDate] = useState<Date | null>(new Date(slotData.endTime));
  const [title, setTitle] = useState(slotData.title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (isOpen) {
      setTopic(slotData.topic);
      setStartDate(new Date(slotData.startTime));
      setEndDate(new Date(slotData.endTime));
      setTitle(slotData.title);
    }
  }, [isOpen, slotData]);

  const handleUpdate = async () => {
    if (!topic || !startDate || !endDate || !title) {
      setError("All fields must be filled.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = `/api/mentorship/mentorshipslots/${slotData.id}`;
      const updatedSlot = {
        topic,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        title
      };

      await createAPIInstance(token).put(endpoint, updatedSlot);
      onUpdateSlot(slotData.id, topic, startDate, endDate, title);
      onClose();
    } catch (error) {
      setError("Failed to update slot. Please try again.");
      console.error('Error updating slot:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-80 md:w-2/5">
        <div className="p-6 m-2">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Edit Slot</h2>
          {error && <p className="text-red-500">{error}</p>}
          <select
            className="select w-full m-2 max-w-xs"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="" disabled>Select Topic</option>
            <option value="Painting">Painting</option>
            <option value="Coding">Coding</option>
            <option value="Writing">Writing</option>
          </select>
          <div className="m-2">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="input"
            />
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="input"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Enter title"
            />
          </div>
          <div className="flex justify-end">
            <button className="btn btn-gray mr-2" onClick={onClose}>Cancel</button>
            <button className="btn" onClick={handleUpdate} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSlotPopup;
