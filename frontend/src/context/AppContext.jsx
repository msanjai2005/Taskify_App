import axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendurl = "https://taskifybackend.vercel.app";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLogout, setIsLogout] = useState(false);

  // Wrap checkAuth in useCallback to prevent unnecessary recreations
  const checkAuth = useCallback(async () => {
    try {
      setIsCheckingAuth(true);
      const res = await axios.get(backendurl + "/api/auth/is-auth", {
        withCredentials: true,
      });
      
      if (res.data.success && res.data.user) {
        // Set both states at once to keep them in sync
        setUserData(res.data.user);
        setIsAuthenticated(true);
        
        // Log after state update (though React batches these)
        console.log("User data set:", res.data.user);
        console.log("Is Verified:", res.data.user.isVerified);
      } else {
        // If no user data in response
        setUserData(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error?.response?.data?.message || error.message);
      setUserData(null);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendurl}/api/task/tasks`, {
        withCredentials: true,
      });

      if (res.data.success) {
        console.log("Tasks fetched:", res.data.tasks?.length || 0, "tasks");
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err?.response?.data?.message || err.message);
      setTasks([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Use async function inside useEffect
    const initializeApp = async () => {
      await checkAuth();
      // Only get tasks if authenticated
      if (isAuthenticated) {
        await getTasks();
      }
    };
    
    initializeApp();
  }, [checkAuth]); // Add checkAuth as dependency

  // Add a separate effect to get tasks when authentication changes
  useEffect(() => {
    if (isAuthenticated && userData) {
      getTasks();
    }
  }, [isAuthenticated, userData]);

  // Helper function to update user data
  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const value = {
    backendurl,
    isAuthenticated,
    setIsAuthenticated,
    userData,
    setUserData,
    updateUserData, // Add this helper function
    tasks,
    setTasks,
    isLoading,
    setIsLoading,
    isCheckingAuth,
    setIsCheckingAuth,
    checkAuth,
    isLogout,
    setIsLogout,
    getTasks
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};