import React, { useState } from "react";
import NavBar from "./NavBar";
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import RightSection from "./RightSection";

const Home: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>("home");

  const handleSelectPage = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <div>
      <NavBar />
      <LeftSection onSelectPage={handleSelectPage} />
      <MiddleSection
        selectedPage={selectedPage}
        onSelectPage={handleSelectPage}
      />
      <RightSection onSelectPage={handleSelectPage} />
    </div>
  );
};

export default Home;
