import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Avather from "../assets/profileImage.png";
import { LuLayoutDashboard } from "react-icons/lu";
import { BiTask } from "react-icons/bi";
import { MdAddToPhotos, MdLogout, MdOutlineLogout } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import Logout from "./Logout";

const Sidebar = ({ isOpen }) => {

  const {isLogout,setIsLogout} = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { userData } = useContext(AppContext);

  return (
    <div className="relative z-50">
      <div
        className={`
          fixed top-[70px] left-0 h-[calc(100vh-70px)] w-60 bg-white border-r border-gray-200 shadow-sm
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="w-full p-5 flex flex-col justify-start items-center">
          <div className="w-15 h-15 rounded-full bg-blue-200 text-3xl text-blue-700 font-bold flex justify-center items-center">
            {userData?.name?.split(" ")[0][0]}{userData?.name?.split(" ")[1][0]}
          </div>
          <p className="font-medium text-blue-900 mt-2">{userData?.name || "guest"}</p>
          <p className="font-medium text-gray-400 text-sm">
            {userData?.email || "guest123@gmail.com"}
          </p>
        </div>

        {/* MENU */}
        <div className="flex flex-col mt-4">
          <SidebarItem
            title="Dashboard"
            path="/dashboard"
            icon={<LuLayoutDashboard className="text-2xl" />}
            currentPath={currentPath}
            navigate={navigate}
          />

          <SidebarItem
            title="Manage Task"
            path="/tasks"
            icon={<BiTask className="text-2xl" />}
            currentPath={currentPath}
            navigate={navigate}
          />

          <SidebarItem
            title="Create Task"
            path="/create-task"
            icon={<MdAddToPhotos className="text-2xl" />}
            currentPath={currentPath}
            navigate={navigate}
          />

          <SidebarItem
            title="Profile Setting"
            path="/profile-settings"
            icon={<RiUserSettingsFill className="text-2xl" />}
            currentPath={currentPath}
            navigate={navigate}
          />
        </div>
        <div  
          onClick={()=>{setIsLogout(!isLogout);}}
          className="rounded-t-xl bg-red-100 hover:bg-red-200 py-3 text-center text-gray-900 font-bold text-[17px] bottom-0 absolute w-full cursor-pointer">
          Logout {" "}
          <MdLogout  className='inline' />
        </div>
      </div>
      
      <div className="hidden lg:block w-60"></div>
    </div>
  );
};

const SidebarItem = ({ title, icon, path, currentPath, navigate }) => {
  const isActive = currentPath === path;

  return (
    <div
      onClick={() => navigate(path)}
      className={`
        px-7 py-3 cursor-pointer tracking-wider text-[17px]
        flex flex-row items-center gap-2
        transition duration-200 hover:bg-blue-50
        ${
          isActive
            ? "border-r-4 border-blue-500 font-bold bg-blue-50 text-blue-800"
            : "font-semibold text-gray-800"
        }
      `}
    >
      {icon}
      <h1>{title}</h1>
    </div>
  );
};

export default Sidebar;
