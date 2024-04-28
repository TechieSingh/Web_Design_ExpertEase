import { useMediaQuery } from "@mui/material";
import MainFeed from "../components/ContentPage/MainFeed";
import React, { useState } from "react";
import TopicFeed from "../components/ContentPage/TopicFeed";
import MentorshipContentPage from "../components/ContentPage/MentorshipContent";

interface MiddleSectionProps {
  selectedPage: string;
  onSelectPage: (page: string) => void; // Adding onSelectPage prop
}

const MiddleSection: React.FC<MiddleSectionProps> = ({
  selectedPage,
  onSelectPage,
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null
  );
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // Render different content based on the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case "home":
        return (
          <MainFeed
            onSelectPage={onSelectPage}
            onArticleSelect={setSelectedArticleId}
          />
        );
      case "mentorship":
        return <MentorshipContentPage/>;
      case "articles":
        return <></>;
      case "topic":
        return (
          <TopicFeed
            onSelectPage={onSelectPage}
            selectedArticleId={selectedArticleId}
          />
        );
      case "person":
        return <></>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-24 ${
        isSmallScreen ? "w-full" : "w-1/2 left-1/4"
      } h-full bg-gradient-to-b from-gray-300 to-white p-4 rounded-3xl overflow-y-auto overflow-hidden`}
      style={{ scrollbarWidth: "none" }}
    >
      {renderContent()}
    </div>
  );
};

export default MiddleSection;
