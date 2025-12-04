import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="w-full bg-gray-100">

      {/* Navbar */}
      <Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} isOpen={isSidebarOpen} />

      <div className="flex flex-row">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} active={active} setActive={setActive}/>

        {/* Page Content */}
        <div className="p-5 w-full min-h-[90vh]">
          <Outlet  onClick={()=>{
          if(isOpen)setActive(false);
        }} context={{ active, setActive }}/>
        </div>
      </div>

    </div>
  );
};

export default Layout;
