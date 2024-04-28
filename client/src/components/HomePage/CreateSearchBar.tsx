import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import createAPIInstance from "../../utils/apiService";
import { Interest, Topic } from "./types/type";

interface CreateSearchBarProps {
  onResultSelect: (item: SearchResult) => void;
  selectedResult: SearchResult | null;
  onRemoveSelectedResult: () => void;
  mode: "topic" | "post";
}

type SearchResult = Interest | Topic;

const CreateSearchBar: React.FC<CreateSearchBarProps> = ({
  onResultSelect: onInterestSelect,
  selectedResult: selectedInterest,
  onRemoveSelectedResult: onRemoveSelectedInterest,
  mode,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (selectedInterest || searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      const api = createAPIInstance(token);
      const endpoint =
        mode === "topic" ? "/api/interests" : "/api/users/topics";

      try {
        const response = await api.get(endpoint, {
          params: { search: searchTerm },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, token, selectedInterest, mode]);

  return (
    <div className="form-control">
      {selectedInterest ? (
        <div className="badge badge-primary flex items-center justify-between p-4">
          <span className="mr-2">
            {"interest_Name" in selectedInterest
              ? selectedInterest.interest_Name
              : selectedInterest.topic_Name}
          </span>
          <button
            onClick={onRemoveSelectedInterest}
            className="btn btn-xs btn-circle"
          >
            x
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder={
            mode === "topic" ? "Search interests..." : "Search topics..."
          }
          className={`input input-bordered ${isLoading ? "loading" : ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      {!selectedInterest && results.length > 0 && (
        <ul className="menu p-2 shadow bg-base-100 rounded-box w-52">
          {results.map((result) => (
            <li key={result._id} onClick={() => onInterestSelect(result)}>
              <a role="button">
                {"interest_Name" in result
                  ? result.interest_Name
                  : result.topic_Name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateSearchBar;
