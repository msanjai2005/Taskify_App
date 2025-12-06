import React, { useContext, useState, useEffect } from "react";
import { ChevronLeft, Plus, X, Edit2, Check } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [subTaskInput, setSubTaskInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { backendurl, setIsLoading } = useContext(AppContext);

  // Fetch task data on component mount
  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendurl}/api/task/tasks/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const task = res.data.task;
        setTitle(task.title || "");
        setDescription(task.description || "");
        setPriority(task.priority || "medium");
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : "");
        setStatus(task.status || "pending");
        setTags(task.tags || []);
        // Transform MongoDB subTasks format to local format
        setSubTasks(
          (task.subTasks || []).map((st) => ({
            id: st._id || Date.now(),
            text: st.text || "",
            completed: st.completed || false
          }))
        );
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load task");
      console.error("Error fetching task:", error);
    }
    setLoading(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddSubTask = () => {
    if (subTaskInput.trim()) {
      setSubTasks([
        ...subTasks,
        { id: Date.now(), text: subTaskInput.trim(), completed: false },
      ]);
      setSubTaskInput("");
    }
  };

  const handleToggleSubTask = (id) => {
    setSubTasks(
      subTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemoveSubTask = (id) => {
    setSubTasks(subTasks.filter((task) => task.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Transform subTasks to match backend format
      const formattedSubTasks = subTasks.map((st) => ({
        text: st.text,
        completed: st.completed
      }));

      const res = await axios.put(
        `${backendurl}/api/task/tasks/${id}`,
        {
          title,
          description,
          priority,
          dueDate,
          status,
          tags,
          subTasks: formattedSubTasks,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate(`/tasks/${id}`);
        // window.location.reload();
        toast.success("Task Updated");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update task");
      console.error("Update error:", error);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-1 pr-3 flex items-center gap-2 text-gray-600 rounded-xl cursor-pointer hover:bg-gray-300 hover:text-gray-800  transition"
          >
            <ChevronLeft size={24} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Edit Task
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-8">
            {/* Task Name */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Task Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task name"
                className="w-full px-4 py-3 text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Priority & Due Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2 sm:px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg"
                      >
                        <span className="font-medium">#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub Tasks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sub Tasks
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={subTaskInput}
                      onChange={(e) => setSubTaskInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSubTask())
                      }
                      placeholder="Add a sub task"
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubTask}
                      className="px-2 sm:px-4 py-2 bg-blue-100 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {subTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleSubTask(task.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                              task.completed
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {task.completed && (
                              <Check size={12} className="text-white" />
                            )}
                          </button>
                          <span
                            className={`${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-700"
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubTask(task.id)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-50 text-red-600 rounded-xl cursor-pointer hover:bg-red-100 transition-colors font-medium"
              >
                Delete Task
              </button>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition-colors font-medium"
              >
                Update Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;