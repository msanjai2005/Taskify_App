import { useNavigate } from "react-router-dom";

const Authbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#F9FAFB]">
      <header className="w-full fixed top-0 left-0 bg-white backdrop-blur-md shadow-sm border-b border-gray-200 z-100">
        <div className="w-full px-5 sm:px-30 h-[70px] flex justify-between items-center">
          <div
            onClick={() => navigate("/")}
            className="flex flex-row justify-center items-center cursor-pointer"
          >
            <img className="w-14" src="../../public/Logo.png" alt="" />
            <h1 className="text-[clamp(1.8rem,3vw,2rem)] font-bold bg-linear-to-bl from-blue-400 to-blue-900 bg-clip-text text-transparent">
              Taskify
            </h1>
          </div>
        </div>
      </header>
      <div className="w-full h-[70px]"></div>
    </div>
  );
};
export default Authbar