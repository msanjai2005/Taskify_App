import React, { useEffect, useState } from "react";
import Authbar from "../components/Authbar";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import GoogleLogo from "../assets/Google_logo.webp";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Loader from '../components/Loader';

const Login = () => {
  const {
    backendurl,
    isLoading,
    setIsLoading,
    setUserData,
    setIsAuthenticated,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;

      if (email.trim() == "" || password.trim() == "") {
        setError("Must fill the all fields");
        return;
      }

      const res = await axios.post(backendurl + "/api/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        setIsAuthenticated(true);
        setUserData(res.data.user);
        navigate("/dashboard");
      }
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Authbar />
      <div className="w-full min-h-[90dvh] p-3 sm:p-10 bg-gray-100 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-[400px] p-3 sm:p-10 bg-white rounded-xl shadow flex flex-col gap-8 sm:gap-3 justify-center items-center"
        >
          {error && (
            <div className="text-red-500 bg-red-50 w-full py-2 px-3 border border-red-700 rounded text-center">
              {error}
            </div>
          )}
          <div className="flex flex-col justify-center items-center text-gray-500">
            <h1 className="text-2xl font-bold text-blue-800 ">Login</h1>
            <p className="">
              Move forward with{" "}
              <span className="text-blue-700 font-semibold">Taskify!</span>
            </p>
          </div>
          <Input
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <div className="w-full">
            <Input
              label="Password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <p
              onClick={() => {
                navigate("/change-password");
              }}
              className="text-blue-700 underline cursor-pointer "
            >
              Forget password?
            </p>
          </div>
          <button
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSubmit(e);
              }
            }}
            type="submit"
            className="w-full px-2 py-1 text-white text-[17px] active:scale-99
            rounded-md cursor-pointer font-bold bg-linear-to-r from-blue-600 to-blue-400 
            hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-600 transition"
          >
            {isLoading ? <Loading size="h-6 w-6" color="white" /> : "Submit"}
          </button>
          <p className="text-gray-700">
            Don't have an account?{" "}
            <span
              className="underline text-blue-700 cursor-pointer "
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
