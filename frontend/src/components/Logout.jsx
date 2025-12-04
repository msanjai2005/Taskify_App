import React, { useContext, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router";

const Logout = () => {
  const {
    backendurl,
    setIsLogout,
    setIsLoading,
    setUserData,
    setIsAuthenticated,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${backendurl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setUserData(null);
        setIsAuthenticated(false);
        setIsLogout(false);
        navigate('/');
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Logout failed");
    }

    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/50 z-1000 flex justify-center items-center"
      onClick={() => setIsLogout(false)}
    >
      <div
        className="w-96 p-6 flex flex-col gap-6 bg-white rounded-xl shadow-lg cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Are you sure you want to logout?
        </h1>

        <p className="text-sm text-gray-500 text-center">
          You will be signed out from your account. You can log in again anytime.
        </p>

        <div className="w-full flex justify-evenly items-center mt-2">
          <button
            onClick={() => setIsLogout(false)}
            className="px-4 py-2 border border-gray-400 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2 transition cursor-pointer"
          >
            Logout
            <FiLogOut className="text-lg" />
          </button>
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}
      </div>
    </div>
  );
};

export default Logout;
