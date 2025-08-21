const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
