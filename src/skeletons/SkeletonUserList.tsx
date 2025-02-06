const SkeletonUserList = ({ itemsPerPage }: { itemsPerPage: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {[...Array(itemsPerPage)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 p-4 rounded-lg shadow-md border animate-pulse"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonUserList;
