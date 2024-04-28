import React from "react";

interface LeftSectionProps {
  onSelectPage: (page: string) => void;
}

const LeftSection: React.FC<LeftSectionProps> = ({ onSelectPage }) => {
  return (
    <div className="fixed top-24 left-2 md:w-1/5 h-full bg-gray-200 rounded-3xl hidden md:block z-10">
      <div className="flex-col space-y-4 m-4">
        <button className="btn btn-block" onClick={() => onSelectPage("home")}>
          Home
        </button>
        <button
          className="btn btn-block"
          onClick={() => onSelectPage("mentorship")}
        >
          Mentorship
        </button>
        <button
          className="btn btn-block"
          onClick={() => onSelectPage("articles")}
        >
          Articles
        </button>
      </div>
      <div className="m-4">
        <button
          className="btn btn-block"
          onClick={() => onSelectPage("person")}
        >
          Person
        </button>
      </div>
    </div>
  );
};

export default LeftSection;
