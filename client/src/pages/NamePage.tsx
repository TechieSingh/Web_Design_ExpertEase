import { FormEvent, useState } from "react";
import NameForm from "../components/RegisterScreen/NameForm";
import UsageOptions from "../components/RegisterScreen/UsageOptionsForm";
import { Navigate, useNavigate } from "react-router-dom";

const NamePage = () => {
  const [name, setName] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Handle the submission of the name
    console.log(name);
    setSubmitted(true);
    navigate("/interests");
  };
  const handleSelectionChange = (newSelection: string) => {
    setSelectedUsage(newSelection);
    // Now you can do something with the selection
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-xl md:text-2xl font-bold mb-16">ExpertEase</h1>
      {!submitted ? (
        <NameForm name={name} setName={setName} onSubmit={handleSubmit} />
      ) : (
        <UsageOptions onSelectionChange={handleSelectionChange} />
      )}
    </div>
  );
};

export default NamePage;
