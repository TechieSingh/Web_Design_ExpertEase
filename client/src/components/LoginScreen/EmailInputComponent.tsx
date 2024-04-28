// EmailInputComponent.tsx

import React, { useState } from "react";

interface EmailInputComponentProps {
  onSend: (email: string) => void;
}

const EmailInputComponent: React.FC<EmailInputComponentProps> = ({
  onSend,
}) => {
  const [localEmail, setLocalEmail] = useState("");

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="flex">
      <input
        type="email"
        placeholder="Type your email"
        className="flex-1 rounded-l-full p-3"
        value={localEmail}
        onChange={(e) => setLocalEmail(e.target.value)}
      />
      <button
        className={`rounded-r-full p-3 ${
          isValidEmail(localEmail) ? "bg-gray-900" : "bg-gray-600"
        } text-white`}
        onClick={() => onSend(localEmail)}
        disabled={!isValidEmail(localEmail)}
      >
        Send link
      </button>
    </div>
  );
};

export default EmailInputComponent;
