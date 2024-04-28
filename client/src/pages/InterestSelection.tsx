// TopicSelection.tsx
import React from "react";
import InterestSelector from "../components/InterestSelectionScreen/InterestSelector";

const InterestSelection: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <h1 className="font-bold mb-4 text-gray-800 lg:text-3xl">
        Follow Topics
      </h1>
      <InterestSelector />
    </div>
  );
};

export default InterestSelection;
