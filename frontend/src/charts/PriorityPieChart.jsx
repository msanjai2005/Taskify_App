import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PriorityPieChart = ({ tasks = [] }) => {
  const priorityData = {
    high: tasks?.filter(t => t.priority === 'high').length,
    medium: tasks?.filter(t => t.priority === 'medium').length,
    low: tasks?.filter(t => t.priority === 'low').length,
  };

  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [priorityData.high, priorityData.medium, priorityData.low],
        backgroundColor: [
          "#EF4444", // Red-500
          "#F59E0B", // Amber-500
          "#10B981", // Emerald-500
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: "'Inter', sans-serif",
            size: 14,
            weight: '500'
          },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} tasks`
        }
      }
    },
    cutout: '55%'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Priority Distribution</h3>
        <div className="text-sm text-gray-500">
          {tasks?.length} total tasks
        </div>
      </div>
      
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High: {priorityData.high}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium: {priorityData.medium}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low: {priorityData.low}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityPieChart;