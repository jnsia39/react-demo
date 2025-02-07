import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/optimization/SearchBar';
import SortOptions from '../components/optimization/SortOptions';
// import UserList from '../components/optimization/UserList';
import Pagination from '../components/optimization/Pagination';
import { User } from '../types/User';
import { useFetch } from '../hooks/useFetch copy';
import SkeletonUserList from '../skeletons/SkeletonUserList';

const UserList = lazy(() => import('../components/optimization/UserList'));

const ITEMS_PER_PAGE = 12;

const params = {
  results: 500,
  inc: 'name, email, phone, cell, picture',
  nat: 'US',
};

function CorrectMain() {
  const [userData, setUserData] = useState<User[]>([]);
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useFetch<User[]>(
    'https://randomuser.me/api/',
    params
  );

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  const filteredUserData = useMemo(() => {
    return userData.filter((user: User) => {
      const fullUsername = `${user.name.first} ${user.name.last}`.toLowerCase();
      return fullUsername.includes(searchQuery.toLowerCase());
    });
  }, [userData, searchQuery]);

  const sortedUserData = useMemo(() => {
    if (sortOption === 'default') return filteredUserData;

    return [...filteredUserData].sort((a, b) => {
      const nameA = `${a.name.first} ${a.name.last}`.toLowerCase();
      const nameB = `${b.name.first} ${b.name.last}`.toLowerCase();

      return sortOption === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [filteredUserData, sortOption]);

  const paginatedUserData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return sortedUserData.slice(startIndex, endIndex);
  }, [currentPage, sortedUserData]);

  useEffect(() => {
    console.log('MainPage Rendering');
  });

  const handleSortOption = (option: string) => {
    setSortOption(option);
  };

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
      {error ? (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mx-auto max-w-md text-center">
          데이터를 불러오지 못했어요... <br />
          잠시 후에 다시 시도해주세요!
        </div>
      ) : (
        <div>
          <Suspense fallback={<SkeletonUserList itemsPerPage={12} />}>
            <UserList users={paginatedUserData} loading={loading} />
          </Suspense>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUserData.length / ITEMS_PER_PAGE)}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default CorrectMain;
