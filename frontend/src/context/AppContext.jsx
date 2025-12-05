import axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // const backendurl = "http://localhost:3000";
  const backendurl = "https://taskifybackend.vercel.app";
  const url = "https://scontent.fmaa1-5.fna.fbcdn.net/v/t39.30808-6/310978423_499209305554529_2661145990430677248_n.png?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=MvIIzJkkIw4Q7kNvwGr4xmr&_nc_oc=Adk28fQZ6i6wpKSrB7goo8U-zPPagq4XkC-GYDupSIEi0uVUj89ROsLrIot1YUZXkFZo9SNnT6urIStLO3klQQNn&_nc_zt=23&_nc_ht=scontent.fmaa1-5.fna&_nc_gid=URd_NT7kWPEYSNwXGhuEvA&oh=00_AflouW18OHxm5LQ8FOUURjLVlmGCllgylt96smlZSgznTw&oe=693822E6"

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
    getTasks,
    url
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};