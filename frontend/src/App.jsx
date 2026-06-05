import { Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/AuthStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EditorPage from "./pages/EditorPage";
import WorkSpacePage from "./pages/WorkSpacePage";

import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkSpacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/:id"
          element={
            <ProtectedRoute>
              <WorkSpacePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
