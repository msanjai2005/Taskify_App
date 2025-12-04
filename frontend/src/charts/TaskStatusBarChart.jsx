import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskStatusBarChart = ({ tasks = [] }) => {
  // Calculate status counts
  const completedCount = tasks?.filter(task => task.status === 'completed').length;
  const pendingCount = tasks?.filter(task => task.status === 'pending').length;
  
  const totalTasks = tasks?.length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const data = {
    labels: ["Tasks"],
    datasets: [
      {
        label: "Completed",
        data: [completedCount],
        backgroundColor: "#10B981", // Emerald-500
        borderColor: "#10B981",
        borderWidth: 0,
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Pending",
        data: [pendingCount],
        backgroundColor: "#F59E0B", // Amber-500
        borderColor: "#F59E0B",
        borderWidth: 0,
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#D1D5DB",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} tasks`
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Task Status</h3>
          <p className="text-sm text-gray-500 mt-1">Completed vs Pending</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
          <div className="text-xs text-gray-500">Completion Rate</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>

      {/* Legend & Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
              <span className="text-sm font-medium text-gray-700">Completed</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{completedCount}</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
              <span className="text-sm font-medium text-gray-700">Pending</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{pendingCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusBarChart;