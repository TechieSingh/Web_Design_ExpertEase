import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div>
        <span className="text-white text-xl font-bold">Your App Name</span>
      </div>
      <div className="md:hidden">
        {/* Hamburger icon for mobile view */}
        <button className="text-white focus:outline-none">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M4 6h16a1 1 0 110 2H4a1 1 0 110-2zm16 5H4a1 1 0 110-2h16a1 1 0 110 2zm0 4H4a1 1 0 110-2h16a1 1 0 110 2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

const LeftSection: React.FC = () => {
  return (
    <div className="bg-gray-200 p-4 md:w-1/4 h-screen">
      {/* Content for the left section */}
    </div>
  );
};

const MiddleSection: React.FC = () => {
  return (
    <div className="bg-gray-300 p-4 md:w-1/2 h-screen">
      {/* Content for the middle section */}
    </div>
  );
};

const RightSection: React.FC = () => {
  return (
    <div className="bg-gray-200 p-4 md:w-1/4 h-screen">
      {/* Content for the right section */}
    </div>
  );
};

const AppLayout: React.FC = ({}) => {
  return (
    <div>
      <NavBar />
      <div className="md:flex">
        <LeftSection />
        <MiddleSection />
        <RightSection />
      </div>
      <div className="md:hidden">
        {/* Mobile navigation drawer */}
        {/* Content for mobile navigation */}
      </div>
    </div>
  );
};

export default AppLayout;
