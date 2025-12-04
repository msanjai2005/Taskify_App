import React from "react";
import { CheckCircle, Circle, Clock, AlertTriangle, Calendar } from "lucide-react";

const TodaysTasks = ({ tasks = [] }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Ensure we always have an array to work with
  const todaysTasks = tasks?.filter(task => {
    const dueDate = task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null;
    return dueDate === today;
  }) || [];

  const pendingTasks = todaysTasks.filter(t => t?.status !== 'completed');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 sm:p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <Calendar size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Today's Tasks</h3>
            <p className="text-sm text-gray-500">
              {todaysTasks.length} task{todaysTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {pendingTasks.length > 0 && (
          <div className="px-4 py-2 bg-linear-to-r from-red-50 to-orange-50 text-red-700 text-sm font-semibold rounded-full border border-red-100 shadow-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              {pendingTasks.length} pending
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-linear-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckCircle size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No tasks for today</p>
            <p className="text-gray-400 text-xs mt-1">Enjoy your day!</p>
          </div>
        ) : (
          todaysTasks.slice(0, 4).map((task, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-gray-50/50 rounded-xl border border-gray-100 transition-all duration-200 group hover:border-blue-100 hover:shadow-sm"
            >
              <div className="shrink-0">
                {task?.status === 'completed' ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-blue-300 transition-colors">
                    <Circle size={16} className="text-gray-400 group-hover:text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  task?.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                }`}>
                  {task?.title || 'Untitled Task'}
                </p>
                {task?.priority === 'high' && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                      <AlertTriangle size={10} className="text-red-600" />
                    </div>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">High priority</span>
                  </div>
                )}
              </div>
              {task?.dueTime && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <Clock size={12} className="text-gray-500" />
                  <span className="font-medium">{task.dueTime}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {todaysTasks.length > 4 && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2.5 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            View {todaysTasks.length - 4} more task{todaysTasks.length - 4 !== 1 ? 's' : ''}
          </button>
        </div>
      )}
      
      {/* Progress indicator */}
      {todaysTasks.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>
              {todaysTasks.filter(t => t?.status === 'completed').length} of {todaysTasks.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-linear-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${(todaysTasks.filter(t => t?.status === 'completed').length / todaysTasks.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysTasks;