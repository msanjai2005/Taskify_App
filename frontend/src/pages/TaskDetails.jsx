import React, { useContext, useEffect, useState } from "react";
import {
  ChevronLeft,
  Edit2,
  Trash2,
  Flag,
  Calendar,
  CheckCircle2,
  Circle,
  Tag,
  CheckSquare,
  Clock,
  MoreVertical,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const TaskDetails = () => {
  const { backendurl, setIsLoading } = useContext(AppContext);

  const [task, setTask] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const priorityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
  };

  const priorityIcons = {
    low: <Flag size={16} className="text-green-600" />,
    medium: <Flag size={16} className="text-yellow-600" />,
    high: <Flag size={16} className="text-orange-600" />,
  };

  const completedCount = task?.subTasks?.filter(st => st.completed).length;
  const progressPercentage = task?.subTasks?.length > 0
    ? Math.round((completedCount / task.subTasks.length) * 100)
    : 0;

  const getTaskDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendurl}/api/task/tasks/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        console.log(res.data.task);
        setTask(res.data.task);
      }
    } catch (error) {
      console.log("Error fetching task:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${backendurl}/api/task/tasks/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/tasks");
        window.location.reload();
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete task");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTaskDetails();
  }, [id]);

  return (
    <div className="min-h-screen sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-2">
          <div className="flex items-center gap-4">
            <button onClick={()=>navigate('/tasks')} className="flex items-center gap-2 p-2 hover:bg-gray-300 cursor-pointer rounded-2xl text-gray-600 hover:text-gray-800 transition-colors group">
              <ChevronLeft
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Task Details
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>navigate(`/Edit-task/${task._id}`)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={18} />
              <span>Edit</span>
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {task && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Task Header */}
            <div className="p-3 md:p-8 border-b border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {task.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        Created:{" "}
                        {new Date(task.createdAt).toISOString().split("T")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Edit2 size={14} />
                      <span>
                        Updated:{" "}
                        {new Date(task.updatedAt).toISOString().split("T")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {priorityIcons[task.priority]}
                    <span className="font-medium capitalize">
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority and Due Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    <Flag size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-medium capitalize">{task.priority}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg">
                    <Calendar size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {new Date(task.dueDate).toISOString().split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                {task.status === "completed" ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <Circle size={18} className="text-blue-500" />
                )}
                <span className="font-medium capitalize">{task.status}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Description
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {task.description ||
                    "Description not mentioned. you can Add your decription by clicking Edit button on the top."}
                </p>
              </div>
            </div>

            {/* Tags Section */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.length<=0 && (
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                    Tags are not mentioned. you can Add your tags by clicking
                    Edit button on the top.
                  </div>
                )}
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub Tasks Section */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckSquare size={20} className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Sub Tasks
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {completedCount}/{task.subTasks.length} ({progressPercentage}%)
                </span>
              </div>
              </div>

              <div className="space-y-3">
                {task.subTasks.length<=0 && (
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                    Subtasks are not mentioned. you can Add your Subtasks by
                    clicking Edit button on the top.
                  </div>
                )}
                {task.subTasks.map((subTask) => (
                  <div
                    key={subTask._id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span
                      className={`flex-1 ${
                        subTask.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {subTask.text}
                    </span>
                    {subTask.completed && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
