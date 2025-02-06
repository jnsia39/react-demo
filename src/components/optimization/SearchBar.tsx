const SearchBar = ({
  searchQuery,
  setSearchQuery,
  setCurrentPage,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleSearchQuery = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // console.log('SearchBar Rendering');

  return (
    <input
      type="text"
      placeholder="Search Username..."
      value={searchQuery}
      onChange={(e) => handleSearchQuery(e.target.value)}
      className="w-full p-2 px-4 border rounded"
    />
  );
};

export default SearchBar;
