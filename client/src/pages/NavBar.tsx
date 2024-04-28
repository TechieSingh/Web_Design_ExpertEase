import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { useState } from "react";
import Modal from "../components/HomePage/CreateModal";

const NavBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"topic" | "post">("post");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleOpenModal = (mode: "topic" | "post") => () => {
    setIsModalOpen(true);
    setMode(mode);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="bg-black p-4 flex items-center justify-between fixed z-10 right-0 left-0">
        <button className="md:hidden text-white focus:outline-none">
          <MenuIcon />
        </button>
        <span className="hidden md:block text-white text-2xl font-bold">
          Expert Ease
        </span>
        <div className="flex-grow flex justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white rounded-md p-2 pr-8 focus:outline-none"
          />
          <button className="btn hidden md:block">Search</button>
        </div>
        <div className="flex items-center justify-end gap-2 rounded-lg bg-black">
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Create
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li onClick={handleOpenModal("topic")}>
                <a>Create Topic</a>
              </li>
              <li onClick={handleOpenModal("post")}>
                <a>Create Post</a>
              </li>
            </ul>
          </div>
          <button className="btn btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 16.5c-.83 0-1.5-.67-1.5-1.5h3c0 .83-.67 1.5-1.5 1.5m5-2.5H7v-1l1-1v-2.61C8 9.27 9.03 7.47 11 7v-.5c0-.57.43-1 1-1s1 .43 1 1V7c1.97.47 3 2.28 3 4.39V14l1 1z"
              />
            </svg>
          </button>
          <button className="btn btn-square" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </nav>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} mode={mode} />
      )}
    </>
  );
};

export default NavBar;
