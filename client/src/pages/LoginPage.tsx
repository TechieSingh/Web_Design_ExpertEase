import axios from "axios";
import { FormEvent, useState } from "react";
import { FaApple } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../features/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      const isFirstLogin = response.data.isFirstLogin;
      dispatch(
        setCredentials({
          token: response.data.token,
          isFirstLogin: isFirstLogin,
        })
      );
      if (isFirstLogin) {
        console.log("Navigating to name ");
        navigate("/name"); // Navigate to enter name if first login
      } else {
        console.log("navigating to home");
        navigate("/home"); // Navigate to home if not the first login
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // We can now access error.response safely
        const message =
          error.response?.data.message || "An unexpected error occurred";
        setError("Login failed: " + message);
      } else {
        // The error might not be from Axios if it doesn't have a response object
        setError("Login failed: An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to<br></br> ExpertEase
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-10">
          <h2 className="mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900">
            Made for Students.
          </h2>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-4 mt-5">
            <button className="flex justify-center items-center gap-3 bg-black text-white rounded-l-full rounded-r-full p-3">
              <FaApple />
              Sign in with Apple
            </button>
            <button className="flex justify-center items-center gap-3 bg-black text-white rounded-l-full rounded-r-full p-3">
              <FaGoogle />
              Sign in with Google
            </button>
            <form
              className="space-y-6"
              action="#"
              method="POST"
              onSubmit={loginUser}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
            <Link
              to="/register"
              className="flex justify-center items-center gap-3 bg-black text-white rounded-l-full rounded-r-full p-3"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
