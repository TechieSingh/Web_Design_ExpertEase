import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NamePage from "./pages/NamePage";
import InterestSelection from "./pages/InterestSelection";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";


axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const { isAuthenticated, isFirstLogin } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <>
      <Routes>
        <Route              
          path="/"
          element={
            isAuthenticated ? (
              isFirstLogin ? (
                <Navigate to="/name" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/name"
          element={
            <ProtectedRoute>
              <NamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interests"
          element={
            <ProtectedRoute>
              <InterestSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
