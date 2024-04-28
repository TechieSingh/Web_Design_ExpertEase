import React, { useEffect, useState } from "react";
import postsData from "../pages/posts.json";

interface RightSectionProp {
  onSelectPage: (page: string) => void;
}

const RightSection: React.FC<RightSectionProp> = ({ onSelectPage }) => {
  const [topics, setTopics] = useState<String[]>([]);

  useEffect(() => {
    try {
      setTopics(postsData.map((post) => post.topic));
    } catch (error) {
      console.error("Error fetching Topic:", error);
    }
  }, []);
  // Dummy data for top topics and mentors
  const topMentors = [
    "Mentor 1",
    "Mentor 2",
    "Mentor 3",
    "Mentor 4",
    "Mentor 5",
  ];

  return (
    <div className="fixed top-24 right-2 md:w-1/5 h-full bg-gray-200 rounded-3xl hidden md:block">
      {" "}
      {/* Hide on mobile screens */}
      <div className="mb-6 m-4">
        <h2 className="text-lg font-bold mb-2">Top Topics</h2>
        <ul className="divide-y divide-gray-300">
          <button></button>
          {topics.map((topic, index) => (
            <li key={index} className="py-2">
              <button
                className="underline hover:text-zinc-950"
                onClick={() => onSelectPage("topic")}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6 m-4">
        <h2 className="text-lg font-bold mb-2">Top Mentors</h2>
        <ul className="divide-y divide-gray-300">
          {topMentors.map((mentor, index) => (
            <li key={index} className="py-2">
              <button>{mentor}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSection;
