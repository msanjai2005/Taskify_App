import React, { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { FiLogIn } from "react-icons/fi";
import {AppContext} from "../context/AppContext"

export const Home = () => {

  const navigate = useNavigate();

  return (
    <div>
      <Homebar />
      <div className="w-screen min-h-[90dvh] bg-stone-100 flex justify-center items-center">
        <div className="p-4 flex flex-col justify-center items-center gap-2 ">
          <h1 className="text-4xl font-semibold text-gray-700 text-center">
            Welcome to our{" "}
            <span className="font-bold text-blue-500">Taskify!</span> App
          </h1>
          <h3 className="text-xl font-medium text-gray-500">
            Let's start your day with taskify
          </h3>
          <button
            onClick={() => {navigate('/register')}}
            className="text-xl text-white font-semibold mt-5 px-4 py-2 rounded-full cursor-pointer border-2 border-blue-600 bg-blue-600 hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600 transition"
          >
            Get Start
          </button>
        </div>
      </div>
    </div>
  );
};

export const Homebar = () => {
  const navigate = useNavigate();
  const {url} = useContext(AppContext);

  return (
    <div className="w-full bg-[#F9FAFB]">
      <header className="w-full fixed top-0 left-0 bg-white backdrop-blur-md shadow-sm border-b border-gray-200 z-100">
        <div className="w-full px-2 sm:px-30 h-[70px] flex justify-between items-center">
          <div
            onClick={() => navigate("/")}
            className="flex flex-row justify-center items-center cursor-pointer"
          >
            <img className="w-14" src={url} alt="" />
            <h1 className="text-[clamp(1.8rem,3vw,2rem)] font-bold bg-linear-to-bl from-blue-400 to-blue-900 bg-clip-text text-transparent">
              Taskify
            </h1>
          </div>
          <Button
            name={
              <>
                Login <FiLogIn className="inline text-xl" />
              </>
            }
            width="w-fit"
            onClick={() => navigate("/login")}
          />
        </div>
      </header>
      <div className="w-full h-[70px]"></div>
    </div>
  );
};
