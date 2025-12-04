
const Button = ({ name, width='w-full', onClick, type='button' }) => {
  return (
    <button
    type={type}
      className={`${width} px-2 py-1 text-white text-[17px] active:scale-99
      rounded-md cursor-pointer font-bold bg-linear-to-r from-blue-600 to-blue-400 
      hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-600 transition`}
      onClick={()=>onClick()}
      >
      {name}
    </button>
  );
};

export default Button;
