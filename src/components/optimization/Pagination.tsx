function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleClick = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const range = 4;

  let startPage = Math.max(1, currentPage - range);
  let endPage = Math.min(totalPages, currentPage + range);

  if (endPage - startPage < 2 * range) {
    if (startPage === 1) {
      endPage = Math.min(
        totalPages,
        endPage + (2 * range - (endPage - startPage))
      );
    } else if (endPage === totalPages) {
      startPage = Math.max(1, startPage - (2 * range - (endPage - startPage)));
    }
  }

  if (totalPages <= 2 * range + 1) {
    startPage = 1;
    endPage = totalPages;
  }

  // console.log("Pagenation Rendering");

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <button
        onClick={() => handleClick(1)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        First
      </button>
      <button
        onClick={() => handleClick(currentPage - 1)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {[...Array(endPage - startPage + 1)].map((_, index) => {
        const pageNumber = startPage + index;
        return (
          <button
            key={pageNumber}
            onClick={() => handleClick(pageNumber)}
            className={`px-4 py-2 border rounded-lg font-medium ${
              currentPage === pageNumber
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={() => handleClick(currentPage + 1)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
      <button
        onClick={() => handleClick(totalPages)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        End
      </button>
    </div>
  );
}

export default Pagination;
