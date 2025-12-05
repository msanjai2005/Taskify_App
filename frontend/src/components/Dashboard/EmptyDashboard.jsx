import { useNavigate } from "react-router";

const EmptyDashboard = () => {

    const navigate = useNavigate();

  return (
    <div className="min-h-[79dvh] flex flex-col items-center justify-center py-16 px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-800">
        No tasks yet
      </h2>
      <p className="text-gray-500 mt-3 text-lg max-w-md">
        You're all caught up! Start by creating your first task and stay productive.
      </p>
      <button onClick={()=>navigate('/create-task')}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl text-lg cursor-pointer font-medium shadow-md hover:bg-blue-700 transition-all"
      >
        + Create Task
      </button>

    </div>
  );
};

export default EmptyDashboard;
