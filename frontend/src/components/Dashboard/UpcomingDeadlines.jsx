import React from "react";
import { Calendar, Clock, AlertTriangle, Flame } from "lucide-react";

const UpcomingDeadlines = ({ tasks = [] }) => {
  // Get today's date and the next 3 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === 2) return "Day After";
    if (diffDays === 3) return "In 3 Days";
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get tasks for specific date (excluding today)
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks?.filter(task => {
      const dueDate = task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null;
      return dueDate === dateString;
    }) || [];
  };

  // Get upcoming days data
  const upcomingDays = [
    { date: tomorrow, tasks: getTasksForDate(tomorrow) },
    { date: dayAfterTomorrow, tasks: getTasksForDate(dayAfterTomorrow) },
    { date: threeDaysFromNow, tasks: getTasksForDate(threeDaysFromNow) }
  ];

  // Calculate urgency level based on days until deadline
  const getUrgencyLevel = (daysUntil) => {
    if (daysUntil === 1) return { 
      color: "text-orange-600", 
      bg: "bg-orange-50", 
      border: "border-orange-200",
      accent: "from-orange-50 to-orange-100"
    };
    if (daysUntil === 2) return { 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      border: "border-amber-200",
      accent: "from-amber-50 to-amber-100"
    };
    return { 
      color: "text-yellow-600", 
      bg: "bg-yellow-50", 
      border: "border-yellow-200",
      accent: "from-yellow-50 to-yellow-100"
    };
  };

  // Get all upcoming tasks
  const allUpcomingTasks = upcomingDays.flatMap(day => day.tasks);
  const totalUpcoming = allUpcomingTasks.length;

  // Get high priority count
  const highPriorityCount = allUpcomingTasks.filter(task => task?.priority === 'high').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 sm:p-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
            <Flame size={18} className="text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Upcoming Deadlines</h3>
            <p className="text-sm text-gray-500">
              Next 3 days • {totalUpcoming} task{totalUpcoming !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {highPriorityCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full">
            <AlertTriangle size={14} />
            <span>{highPriorityCount} urgent</span>
          </div>
        )}
      </div>

      {totalUpcoming === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-linear-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No upcoming deadlines</p>
          <p className="text-gray-400 text-xs mt-1">All clear for the next 3 days</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingDays.map((dayData, index) => {
            const daysUntil = index + 1; // 1, 2, or 3 days
            const urgency = getUrgencyLevel(daysUntil);
            
            if (dayData.tasks.length === 0) return null;

            return (
              <div 
                key={index}
                className={`border rounded-xl p-4 ${urgency.border} ${urgency.bg} transition-all duration-200 hover:shadow-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-linear-to-br ${urgency.accent}`}>
                      <Calendar size={14} className={urgency.color} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${urgency.color}`}>
                        {formatDate(dayData.date)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {dayData.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${urgency.bg} ${urgency.color} border ${urgency.border}`}>
                    {dayData.tasks.length} task{dayData.tasks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {dayData.tasks.map((task, taskIndex) => (
                    <div 
                      key={taskIndex}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {task?.title || 'Untitled Task'}
                          </p>
                          {task?.priority === 'high' && (
                            <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                              <AlertTriangle size={10} />
                              High
                            </div>
                          )}
                        </div>
                        
                        {task?.dueTime && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock size={12} />
                              <span className="font-medium">{task.dueTime}</span>
                            </div>
                            {task?.status === 'completed' && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats summary */}
      {totalUpcoming > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            {upcomingDays.map((dayData, index) => {
              const daysUntil = index + 1;
              const urgency = getUrgencyLevel(daysUntil);
              
              return (
                <div 
                  key={index}
                  className={`text-center p-3 rounded-lg border ${urgency.border} ${urgency.bg}`}
                >
                  <p className="text-2xl font-bold mb-1">
                    <span className={urgency.color}>{dayData.tasks.length}</span>
                  </p>
                  <p className={`text-xs font-medium ${urgency.color}`}>
                    {daysUntil === 1 ? 'Tomorrow' : 
                     daysUntil === 2 ? 'Day After' : 
                     'In 3 Days'}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Additional info */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Tomorrow</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Day After</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>In 3 Days</span>
              </div>
            </div>
            <span className="font-medium">
              Total: {totalUpcoming} task{totalUpcoming !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadlines;