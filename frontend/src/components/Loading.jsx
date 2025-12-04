const Loading = ({size='h-10 w-10', color='blue-500'}) => {
  return (
    <div className="flex items-center justify-center h-full w-full my-1">
      <div className={`${size} border-3 border-${color} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loading;
