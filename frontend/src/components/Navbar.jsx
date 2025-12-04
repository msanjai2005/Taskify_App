import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { AppContext } from "../context/AppContext";

const Navbar = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="w-full bg-[#F9FAFB]">
      <header className="w-full fixed top-0 left-0 bg-white backdrop-blur-md shadow-sm border-b border-gray-200 z-100">
        <div className="w-full px-5 sm:px-30 h-[70px] flex justify-between items-center">
          <button
            className="lg:hidden text-3xl text-blue-900 transition-all duration-200 cursor-pointer"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <RxCross1 className="transition-transform duration-200 hover:rotate-90 " />
            ) : (
              <GiHamburgerMenu className="transition-transform duration-200" />
            )}
          </button>
          <div
            onClick={() => navigate("/")}
            className="flex flex-row justify-center items-center cursor-pointer"
          >
            <img className="w-14" src="../../public/Logo.png" alt="" />
            <h1 className="text-[clamp(1.4rem,3vw,2rem)] font-bold bg-linear-to-bl from-blue-400 to-blue-900 bg-clip-text text-transparent">
              Taskify
            </h1>
          </div>
          {userData?.name ?(<div onClick={()=>navigate('/profile-settings')} className="w-10 h-10 bg-blue-800 rounded-full cursor-pointer text-white text-3xl font-bold flex justify-center items-center">{userData.name[0]}</div>):(
            <div className="w-11 h-11 bg-linear-to-bl from-blue-400 to-blue-900 rounded-full flex justify-center items-center cursor-pointer">
              <FaRegUser className="text-white text-2xl" />
            </div>)}
        </div>
      </header>
      <div className="w-full h-[70px]"></div>
    </div>
  );
};

export default Navbar;
