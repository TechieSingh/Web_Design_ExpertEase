import React, { useState } from "react";

interface Slot {
  id: number;
  topic: string;
  startTime: string;
  endTime: string;
  title: string;
}

const BookSlots: React.FC<{ slots: Slot[]; onBookSlot: (slot: Slot) => void }> = ({ slots, onBookSlot }) => {
  const handleBookSlot = (slot: Slot) => {
    onBookSlot(slot);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Book Slots</h2>
      {slots.map((slot) => (
        <div key={slot.id} className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-3 flex items-center">
            <span className="mr-4">Name</span>
            <span className="mr-4">Topic</span>
            <span className="mr-4">Title</span>
            <span>Time</span>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            onClick={() => handleBookSlot(slot)}
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookSlots;
