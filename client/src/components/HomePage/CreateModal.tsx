import React, { useState } from "react";
import CreateSearchBar from "./CreateSearchBar";
import createAPIInstance from "../../utils/apiService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Interest, Topic } from "./types/type";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "topic" | "post";
}

type SearchResult = Interest | Topic;

function isTopic(result: SearchResult | null): result is Topic {
  return (result as Topic).topic_ID !== undefined;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, mode }) => {
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [topicNameTouched, setTopicNameTouched] = useState(false);
  const [topicDescriptionTouched, setTopicDescriptionTouched] = useState(false);
  const [postTitleTouched, setPostTitleTouched] = useState(false);
  const [postContentTouched, setPostContentTouched] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const isValidTopic =
    topicName.trim() !== "" &&
    topicDescription.trim() !== "" &&
    selectedResult !== null;
  const isValidPost =
    postTitle.trim() !== "" &&
    postContent.trim() !== "" &&
    selectedResult !== null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "topicName":
        setTopicName(value);
        setTopicNameTouched(true);
        break;
      case "topicDescription":
        setTopicDescription(value);
        setTopicDescriptionTouched(true);
        break;
      case "postTitle":
        setPostTitle(value);
        setPostTitleTouched(true);
        break;
      case "postContent":
        setPostContent(value);
        setPostContentTouched(true);
        break;
    }
  };

  const handleSubmit = async () => {
    if (mode === "topic" && !isValidTopic) return;
    if (mode === "post" && !isValidPost) return;

    const api = createAPIInstance(token);
    let data = {};
    let url = "";

    if (mode === "topic") {
      data = {
        topic_Name: topicName,
        topic_Description: topicDescription,
        topic_Photo: "image string", // This should handle a real image upload or similar
        interest_ID: selectedResult?.interest_ID,
      };
      url = "/api/topics"; // Assuming this is the correct endpoint for creating topics
    } else if (mode === "post") {
      if (isTopic(selectedResult)) {
        data = {
          article_Content: postContent,
          article_Title: postTitle,
        };
        url = `/api/articles/topics/${selectedResult?.topic_ID}`;
      }
    }

    try {
      const response = await api.post(url, data);
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error(`Error creating ${mode}:`, error);
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`} id="my-modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {mode === "topic" ? "Create a Topic" : "Create a Post"}
        </h3>
        <div className="py-4">
          <CreateSearchBar
            onResultSelect={setSelectedResult}
            selectedResult={selectedResult}
            onRemoveSelectedResult={() => setSelectedResult(null)}
            mode={mode}
          />
          {mode === "topic" ? (
            <>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Topic Name</span>
                </label>
                <input
                  type="text"
                  name="topicName"
                  placeholder="Enter topic name"
                  className={`input input-bordered ${
                    topicNameTouched && !isValidTopic ? "input-error" : ""
                  }`}
                  value={topicName}
                  onChange={handleChange}
                />
                {topicNameTouched && !topicName && (
                  <p className="text-error text-xs mt-2">
                    Topic name is required.
                  </p>
                )}
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Topic Description</span>
                </label>
                <textarea
                  name="topicDescription"
                  placeholder="Enter topic description"
                  className={`textarea textarea-bordered ${
                    topicDescriptionTouched && !isValidTopic
                      ? "textarea-error"
                      : ""
                  }`}
                  value={topicDescription}
                  onChange={handleChange}
                />
                {topicDescriptionTouched && !topicDescription && (
                  <p className="text-error text-xs mt-2">
                    Topic description is required.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Post Title</span>
                </label>
                <input
                  type="text"
                  name="postTitle"
                  placeholder="Enter post title"
                  className={`input input-bordered ${
                    postTitleTouched && !isValidPost ? "input-error" : ""
                  }`}
                  value={postTitle}
                  onChange={handleChange}
                />
                {postTitleTouched && !postTitle && (
                  <p className="text-error text-xs mt-2">
                    Post title is required.
                  </p>
                )}
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Post Content</span>
                </label>
                <textarea
                  name="postContent"
                  placeholder="Enter post content"
                  className={`textarea textarea-bordered ${
                    postContentTouched && !isValidPost ? "textarea-error" : ""
                  }`}
                  value={postContent}
                  onChange={handleChange}
                />
                {postContentTouched && !postContent && (
                  <p className="text-error text-xs mt-2">
                    Post content is required.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${
              (mode === "topic" && !isValidTopic) ||
              (mode === "post" && !isValidPost)
                ? "btn-disabled"
                : ""
            }`}
            onClick={handleSubmit}
            disabled={mode === "topic" ? !isValidTopic : !isValidPost}
          >
            Create {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
