import React, { useContext, useState } from "react";
import Authbar from "../components/Authbar";
import Input from "../components/Input";
import GoogleLogo from "../assets/Google_logo.webp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";

const Register = () => {
  const { backendurl, isLoading, setIsLoading, userData, setUserData, setIsAuthenticated } = useContext(AppContext);

  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      axios.defaults.withCredentials = true;
      if(Name.trim()=='' || email.trim()=='' || password.trim()=='' || conformPassword.trim()==''){
        setError("Must fill the all fields...")
        return;
      }
      if (password.length < 6) {
        setError("password length must be above 6");
        return;
      }

      if (password !== conformPassword) {
        setError("Password Not Match");
        return;
      }
      const res = await axios.post(backendurl + "/api/auth/register", { Name,email,password},{ withCredentials: true });

      if (res.data.success) {
        setUserData(res.data.user);
        setIsAuthenticated(true);
        console.log(userData);
        setError("");
        navigate('/email-verify');
      }
      else{
        console.log(res.data.message);
      }
      setError("");
    } catch (error) {
      setError(error.response?.data?.message);
      console.log(error.response?.data?.message || error.message);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Authbar />
      <div className="w-full min-h-[90dvh] p-3 sm:p-10 bg-gray-100 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full sm:w-[400px] p-3 sm:p-10 bg-white rounded-xl shadow flex flex-col gap-4 sm:gap-3 justify-center items-center">
          {error && (
            <div className="text-red-500 bg-red-50 w-full py-2 px-3 border border-red-700 rounded text-center">
              {error}
            </div>
          )}
          <div className="flex flex-col justify-center items-center text-gray-500">
            <h1 className="text-2xl font-bold text-blue-800 ">Register</h1>
            <p className="">
              Move forward with{" "}
              <span className="text-blue-700 font-semibold">Taskify!</span>
            </p>
          </div>
          <Input
            label="Name"
            type="text"
            value={Name}
            placeholder="Enter your full name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your Email"
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            label="Conform Password"
            type="text"
            value={conformPassword}
            placeholder="Enter your conform password"
            onChange={(e) => {
              setConformPassword(e.target.value);
            }}
          />
          <button type="submit"
            onKeyDown={(e)=>{
              if(e.key =='Enter'){handleSubmit(e);}
            }}
            className="w-full px-2 py-1 text-white text-[17px] active:scale-99
            rounded-md cursor-pointer font-bold bg-linear-to-r from-blue-600 to-blue-400 
            hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-600 transition"
          >
            {isLoading?(<Loading size="h-6 w-6" color="white"/>):"Submit"}
          </button>
          <p className="text-gray-700">
            Already have an account?{" "}
            <span
              className="underline text-blue-700 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
