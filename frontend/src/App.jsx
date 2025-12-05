import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerify from "./pages/EmailVerify";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/Dashboard";
import ManageTask from "./pages/ManageTasks";
import CreateTask from "./pages/CreateTask";
import ProfileSetting from "./pages/ProfileSettings";
import EditTask from "./pages/EditTask";
import TaskDetails from "./pages/TaskDetails"
import {Home} from "./pages/Home";
import Layout from "./Layout/Layout";
import { Toaster } from "react-hot-toast";
import { AppContext } from "./context/AppContext";
import Loader from "./components/Loader";
import Logout from "./components/Logout";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userData, isCheckingAuth } = useContext(AppContext);

  // Show loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Check if userData exists before accessing its properties
  if (userData && !userData.isVerified) {
    console.log("User not verified, redirecting to email-verify");
    return <Navigate to="/email-verify" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, userData, isCheckingAuth } = useContext(AppContext);

  // Show loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Only redirect if authenticated AND userData exists AND isVerified is true
  if (isAuthenticated && userData && userData.isVerified) {
    console.log("User is authenticated and verified, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const { isCheckingAuth, isLogout } = useContext(AppContext);

  if (isCheckingAuth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isLogout && <Logout />}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Email verify route - only accessible if authenticated but not verified */}
        <Route
          path="/email-verify"
          element={
            <ProtectedRouteForEmailVerify>
              <EmailVerify />
            </ProtectedRouteForEmailVerify>
          }
        />

        <Route
          path="/change-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgetPassword />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <ManageTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-task"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSetting />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <TaskDetails />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

const ProtectedRouteForEmailVerify = ({ children }) => {
  const { isAuthenticated, userData, isCheckingAuth } = useContext(AppContext);

  if (isCheckingAuth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userData && userData?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default App;