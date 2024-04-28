import { FC, FormEvent } from "react";

// Define the props types
interface NameFormProps {
  name: string;
  setName: (name: string) => void;
  onSubmit: (event: FormEvent) => void;
}

const NameForm: FC<NameFormProps> = ({ name, setName, onSubmit }) => {
  return (
    <div className="bg-gray-800 text-white p-8 rounded-xl">
      <h2 className="text-xl mb-2">What should we call you?</h2>
      <p className="mb-4">
        Let's get to know each other — tell us your first and last name.
      </p>
      <form onSubmit={onSubmit} className="flex">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="flex-1 rounded-l-full p-5 text-gray-800"
        />
        <button
          type="submit"
          className={`rounded-r-full p-5 transition-colors ${
            name
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-300 cursor-not-allowed"
          }`}
          disabled={!name}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default NameForm;
