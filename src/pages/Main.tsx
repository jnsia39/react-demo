import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/optimization/SearchBar';
import SortOptions from '../components/optimization/SortOptions';
import UserList from '../components/optimization/UserList';
import Pagination from '../components/optimization/Pagination';
import { User } from '../types/User';

const itemsPerPage = 12;
const apiUrl = 'https://randomuser.me/api/';
const params = {
  results: 500,
  inc: 'name, email, phone, cell, picture',
  nat: 'US',
};

function Main() {
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSortOption = (option: string) => {
    setSortOption(option);
  };

  // useEffect(() => {
  //   console.log('MainPage Rendering');
  // });

  return (
    <div className="max-w-4xl mx-auto px-2 py-4">
      <div className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-gray-300">
        Find Your Client
      </div>
      <div className="flex gap-2 mb-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
        />
        <SortOptions
          sortOption={sortOption}
          handleSortOption={handleSortOption}
        />
      </div>
      {/* {error ? (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mx-auto max-w-md text-center">
          데이터를 불러오지 못했어요... <br />
          잠시 후에 다시 시도해주세요!
        </div>
      ) : (
        <div>
          <UserList users={paginatedUsers} loading={loading} />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )} */}
    </div>
  );
}

export default Main;
