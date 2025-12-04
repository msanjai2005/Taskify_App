import React, { useContext, useState, useMemo } from "react";
import Button from "../components/Button";
import { LuListTodo } from "react-icons/lu";
import { MdOutlineTaskAlt, MdDelete } from "react-icons/md";
import { GrInProgress } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ManageTasks = () => {
  const navigate = useNavigate();
  const { tasks, setIsLoading, backendurl } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueFilter, setDueFilter] = useState("");
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");

  // Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Apply filters and sorting to tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...safeTasks];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(task =>
        task?.title?.toLowerCase().includes(search.toLowerCase()) ||
        (task?.description && task.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(task =>
        task?.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter(task =>
        task?.priority?.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Apply due date filter
    if (dueFilter) {
      filtered = filtered.filter(task => {
        if (!task?.dueDate) return false;
        const taskDueDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDueDate === dueFilter;
      });
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case "date_new":
          filtered.sort((a, b) => {
            const dateA = new Date(a?.createdAt || a?.dueDate || 0);
            const dateB = new Date(b?.createdAt || b?.dueDate || 0);
            return dateB - dateA;
          });
          break;
        case "date_old":
          filtered.sort((a, b) => {
            const dateA = new Date(a?.createdAt || a?.dueDate || 0);
            const dateB = new Date(b?.createdAt || b?.dueDate || 0);
            return dateA - dateB;
          });
          break;
        case "priority_high":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          filtered.sort((a, b) => {
            const priorityA = priorityOrder[a?.priority] || 0;
            const priorityB = priorityOrder[b?.priority] || 0;
            return priorityB - priorityA;
          });
          break;
        case "priority_low":
          const priorityOrderLow = { high: 3, medium: 2, low: 1 };
          filtered.sort((a, b) => {
            const priorityA = priorityOrderLow[a?.priority] || 0;
            const priorityB = priorityOrderLow[b?.priority] || 0;
            return priorityA - priorityB;
          });
          break;
        case "az":
          filtered.sort((a, b) => (a?.title || '').localeCompare(b?.title || ''));
          break;
        case "za":
          filtered.sort((a, b) => (b?.title || '').localeCompare(a?.title || ''));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [safeTasks, search, statusFilter, priorityFilter, dueFilter, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${backendurl}/api/task/tasks/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        // Instead of reloading the page, we could update the context state
        // But for now, we'll reload to get fresh data
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to delete task");
      setIsLoading(false);
    }
  };

  // Calculate stats based on filtered tasks
  const completedCount = filteredTasks.filter((t) => t?.status === "completed").length;
  const pendingCount = filteredTasks.filter((t) => t?.status === "pending").length;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row justify-between gap-6">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-3/4 flex flex-col">
        {/* Top Header */}
        <div className="w-full sm:px-5 sm:py-3 flex justify-between items-center">
          <h1 className="text-3xl font-semibold bg-linear-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <Button name="Create Task" width="w-32" onClick={() => { navigate('/create-task') }} />
        </div>

        {/* Stats Box - Shows filtered stats */}
        <div className="w-full sm:px-5">
          <div className="w-full py-6 grid grid-cols-1 sm:grid-cols-3 gap-5 bg-transparent">
            {/* All Tasks */}
            <div className="p-2 lg:p-5 rounded-2xl shadow bg-white border border-orange-300 hover:shadow-lg hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-2 md:gap-1 lg:gap-3">
                <div className="p-3 bg-orange-200 text-orange-700 rounded-xl">
                  <LuListTodo />
                </div>
                <div>
                  <p className="text-gray-600 font-medium">All Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredTasks.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="p-2 lg:p-5 rounded-2xl shadow bg-white border border-green-300 hover:shadow-lg hover:scale-[1.02] transition-all">
              <div className="flex gap-2 md:gap-1 lg:gap-3 items-center">
                <div className="p-3 bg-green-200 text-green-700 rounded-xl">
                  <MdOutlineTaskAlt />
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className=" p-2 lg:p-5 rounded-2xl shadow bg-white border border-red-300 hover:shadow-lg hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-2 md:gap-1 lg:gap-3">
                <div className="p-3 bg-red-200 text-red-700 rounded-xl">
                  <GrInProgress />
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(search || statusFilter || priorityFilter || dueFilter || sort) && (
          <div className="w-full sm:px-5 mb-4">
            <div className="flex flex-wrap gap-2 items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </span>
              )}
              
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("")} className="text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </span>
              )}
              
              {priorityFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm">
                  Priority: {priorityFilter}
                  <button onClick={() => setPriorityFilter("")} className="text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </span>
              )}
              
              {dueFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm">
                  Due: {dueFilter}
                  <button onClick={() => setDueFilter("")} className="text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </span>
              )}
              
              {sort && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm">
                  Sorted by: {sort.replace('_', ' ')}
                  <button onClick={() => setSort("")} className="text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </span>
              )}
              
              <button
                onClick={() => {
                  setSearch("");
                  setSort("");
                  setStatusFilter("");
                  setPriorityFilter("");
                  setDueFilter("");
                }}
                className="ml-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className="w-full sm:px-5">
          {error && <p className="text-red-500 font-semibold pb-2 pl-2">{error}</p>}
          
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTasks.map((task) => (
                <div key={task?._id || Math.random()} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 hover:scale-[1.01] hover:shadow-xl transition">
                  <div className="flex justify-between items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                      {task?.title || "Untitled Task"}
                    </h2>
                    <div
                      onClick={() => handleDelete(task?._id)}
                      className="text-2xl text-red-500 font-semibold cursor-pointer hover:text-red-700 transition">
                      <MdDelete />
                    </div>
                  </div>

                  {task?.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center gap-2 mt-2">
                    <p className="text-sm text-gray-500">
                      Due: {task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "No due date"}
                    </p>
                    <div className={`px-3 py-1 rounded-xl text-sm font-medium capitalize ${
                      task?.priority === "low" ? "text-green-700 bg-green-200" :
                      task?.priority === "medium" ? "text-orange-700 bg-orange-200" :
                      "text-red-700 bg-red-200"
                    }`}>
                      {task?.priority || "No priority"}
                    </div>
                  </div>

                  {/* STATUS + VIEW BUTTON */}
                  <div className="mt-3 flex justify-between items-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-lg text-white font-medium capitalize ${
                        task?.status === "completed"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {task?.status || "Unknown"}
                    </span>

                    <Button
                      name="View"
                      width="w-20"
                      onClick={() => {
                        navigate(`/tasks/${task?._id}`);
                      }}
                      disabled={!task?._id}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow">
              <h2 className="text-xl font-semibold text-gray-800">
                {safeTasks.length === 0 ? "No Tasks Found" : "No Tasks Match Your Filters"}
              </h2>
              <p className="text-gray-500 mt-2">
                {safeTasks.length === 0 
                  ? "Create your first task to get started!"
                  : "Try adjusting your filters or clear them to see all tasks."
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - FILTERS & SORTING */}
      <div className="w-full lg:w-1/4 bg-white rounded-xl shadow p-5 h-fit">
        <div className="flex flex-col gap-6 w-full">
          {/* Heading */}
          <h2 className="text-xl font-semibold text-gray-800">
            Filters & Sorting
          </h2>

          {/* Search Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              className="px-3 py-2 border rounded-lg focus:outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Status</label>
            <select
              value={statusFilter}
              className="px-3 py-2 border rounded-lg focus:outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Priority
            </label>
            <select
              value={priorityFilter}
              className="px-3 py-2 border rounded-lg focus:outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Due Date Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Due Date
            </label>
            <input
              type="date"
              value={dueFilter}
              className="px-3 py-2 border rounded-lg focus:outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setDueFilter(e.target.value)}
            />
          </div>

          {/* Sorting */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Sort By</label>
            <select
              value={sort}
              className="px-3 py-2 border rounded-lg focus:outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">None (Default)</option>
              <option value="date_new">Newest First</option>
              <option value="date_old">Oldest First</option>
              <option value="priority_high">High Priority First</option>
              <option value="priority_low">Low Priority First</option>
              <option value="az">A → Z (Title)</option>
              <option value="za">Z → A (Title)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSearch("");
              setSort("");
              setStatusFilter("");
              setPriorityFilter("");
              setDueFilter("");
            }}
            className="px-4 py-2 mt-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition border border-gray-300"
          >
            Clear All Filters
          </button>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-lg font-bold text-blue-700">{filteredTasks.length}</p>
                <p className="text-xs text-gray-600">Filtered</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-lg font-bold text-blue-700">{safeTasks.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;