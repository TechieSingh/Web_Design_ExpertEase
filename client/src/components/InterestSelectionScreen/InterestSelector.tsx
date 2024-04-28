// TopicSelector.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import createAPIInstance from "../../utils/apiService";

const InterestSelector: React.FC = () => {
  // State to track selected topics
  const [interests, setInterests] = useState<
    { interest_Name: string; _id: string }[]
  >([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const api = createAPIInstance(token);
    const fetchInterests = async () => {
      try {
        const response = await api.get("/api/interests");
        setInterests(response.data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests();
  }, []);

  const handleSelectTopic = (interestId: string) => {
    setSelectedTopics((prevSelectedTopics) =>
      prevSelectedTopics.includes(interestId)
        ? prevSelectedTopics.filter((id) => id !== interestId)
        : [...prevSelectedTopics, interestId]
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
      {interests.map((interest) => (
        <div
          key={interest._id}
          className={`border p-4 ${
            selectedTopics.includes(interest._id) ? "bg-blue-200" : "bg-white"
          } rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg`}
          onClick={() => handleSelectTopic(interest._id)}
        >
          <p className="text-sm text-center mt-2 lg:mt-8 lg:text-xl">
            {interest.interest_Name}
          </p>
        </div>
      ))}
      <div className="col-span-3 flex justify-end lg:col-span-4">
        <button
          className="mt-4 bg-black text-white py-2 px-4 rounded"
          disabled={selectedTopics.length < 5}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default InterestSelector;
