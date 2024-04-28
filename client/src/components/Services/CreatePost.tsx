import React, { useState } from "react";

interface CreatePostPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (title: string, content: string) => void;
}

const CreatePostPopup: React.FC<CreatePostPopupProps> = ({
  isOpen,
  onClose,
  onCreatePost,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = () => {
    onCreatePost(title, content);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-80 md:w-2/5">
        <div className="p-6 m-2">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Create Post</h2>
          <select className="select w-full m-2 max-w-xs">
            <option disabled selected>
              Select Topic
            </option>
            <option>Homer</option>
            <option>Marge</option>
            <option>Bart</option>
            <option>Lisa</option>
            <option>Maggie</option>
          </select>
          <input type="text" placeholder="Title" className="input w-full m-2" />
          <textarea
            placeholder="Content"
            className="textarea textarea-bordered textarea-lg w-full m-2"
          ></textarea>
          <div className="flex justify-end">
            <button className="btn btn-gray mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" onClick={handleCreatePost}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPopup;
