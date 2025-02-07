const SortOptions = ({
  sortOption,
  handleSortOption,
}: {
  sortOption: string;
  handleSortOption: (option: string) => void;
}) => {
  // console.log('SortOptions Rendering');

  return (
    <select
      value={sortOption}
      onChange={(e) => handleSortOption(e.target.value)}
      className="p-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      <option
        value="default"
        className="text-gray-700 bg-white hover:bg-blue-100"
      >
        Default
      </option>
      <option value="asc" className="text-gray-700 bg-white hover:bg-blue-100">
        Ascending
      </option>
      <option value="desc" className="text-gray-700 bg-white hover:bg-blue-100">
        Descending
      </option>
    </select>
  );
};

export default SortOptions;
