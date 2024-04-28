import { useState, FC, ChangeEvent } from "react";

interface UsageOptionsProps {
  onSelectionChange: (selection: string) => void;
}

const UsageOptions: FC<UsageOptionsProps> = ({ onSelectionChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelection = event.target.value;
    setSelectedOption(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="bg-gray-800 text-white p-8 rounded-xl">
      <h2 className="text-xl mb-2">How do you want to use ExpertEase?</h2>
      <p className="mb-4">Help us personalize your experience.</p>
      <form className="mb-4">
        <label className="block mb-2">
          <input
            type="radio"
            name="usageOption"
            value="personal"
            onChange={handleSelectionChange}
            checked={selectedOption === "personal"}
            className="form-radio text-purple-600"
          />
          <span className="ml-2">Mentor</span>
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            name="usageOption"
            value="collaboration"
            onChange={handleSelectionChange}
            checked={selectedOption === "collaboration"}
            className="form-radio text-purple-600"
          />
          <span className="ml-2">Mentee</span>
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            name="usageOption"
            value="both"
            onChange={handleSelectionChange}
            checked={selectedOption === "both"}
            className="form-radio text-purple-600"
          />
          <span className="ml-2">Both</span>
        </label>
      </form>
      <button className="p-2 rounded bg-purple-600 hover:bg-purple-700 transition-colors w-full">
        Next
      </button>
    </div>
  );
};

export default UsageOptions;
