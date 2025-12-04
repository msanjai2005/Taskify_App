import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { BsDot } from "react-icons/bs";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import PriorityPieChart from "../charts/PriorityPieChart";
import TaskStatusBarChart from "../charts/TaskStatusBarChart";
import TodaysTasks from "../components/Dashboard/TodaysTasks";
import UpcomingDeadlines from "../components/Dashboard/UpcomingDeadlines";
import EmptyDashboard from "../components/Dashboard/EmptyDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, loadingAuth, tasks } = useContext(AppContext);

  if (loadingAuth) {
    return <Loading size="w-20 h-20" color="blue-500" />;
  }
  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="sm:p-5 space-y-6 ">
      {tasks?.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <>
          <div className="grid grid-cols-1 ">
            <div className="p-5 sm:p-6 rounded-xl shadow bg-white flex flex-col sm:flex-row justify-between items-center">
              <div className="">
                <h1 className="text-2xl font-semibold text-blue-900">
                  Welcome! {userData.name}
                </h1>
                <p className="text-[#6771ff]">
                  {new Date().toDateString()}{" "}
                  <BsDot className="inline text-xl text-blue-700" />{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Button
                name="Create Task"
                width="w-30"
                onClick={() => {
                  navigate("/create-task");
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriorityPieChart tasks={tasks} />
            <TaskStatusBarChart tasks={tasks} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TodaysTasks tasks={tasks} />
            <UpcomingDeadlines tasks={tasks} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
