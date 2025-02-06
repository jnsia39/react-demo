import { useEffect, useState } from 'react';
import SearchBar from '../components/optimization/SearchBar';
import SortOptions from '../components/optimization/SortOptions';
import UserList from '../components/optimization/UserList';
import Pagination from '../components/optimization/Pagination';
import { User } from '../types/User';
import axios from 'axios';

const itemsPerPage = 12;
const apiUrl = 'https://randomuser.me/api/'
const params = {
  results: 500,
  inc: 'name, email, phone, cell, picture',
  nat: 'US',
};

function Main() {
  const [originalUsers, setOriginalUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [paginatedUsers, setPaginatedUsers] = useState([])
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    axios.get(apiUrl, {params})
    .then((res) => {
      const results = res.data.results
      setOriginalUsers(results)
      setLoading(false)
    })
    .catch((error: unknown) => {
      setError(error)
    })
  }, [apiUrl])

  const updatePaginatedUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setPaginatedUsers(filteredUsers.slice(startIndex, endIndex));
  };

  useEffect(() => {
    updatePaginatedUsers()
  }, [filteredUsers, currentPage])

  const filterByUsername = () => {
    const newUserData = originalUsers.filter((user: User) => {
      const fullUsername = `${user.name.first} ${user.name.last}`.toLowerCase();
      return fullUsername.includes(searchQuery.toLowerCase());
    });

    setFilteredUsers(newUserData);
  };

  useEffect(() => {
    filterByUsername()
  }, [searchQuery, originalUsers])

  const sortByUsername = () => {
    if (sortOption === 'default') return filteredUsers;

    const newFilteredUsers = JSON.parse(JSON.stringify(filteredUsers));

    newFilteredUsers.sort((a: User, b: User) => {
      const nameA = (a.name.first + ' ' + a.name.last).toLowerCase();
      const nameB = (b.name.first + ' ' + b.name.last).toLowerCase();

      return sortOption === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredUsers(newFilteredUsers);
  };

  useEffect(() => {
    sortByUsername()
  }, [sortOption])

  useEffect(() => {
    console.log('MainPage Rendering');
  });

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
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
      </div>
      {error ? (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mx-auto max-w-md text-center">
          데이터를 불러오지 못했어요... <br />
          잠시 후에 다시 시도해주세요!
        </div>
      ) : (
        <div>
          <UserList users={paginatedUsers} loading={loading} />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(originalUsers.length / itemsPerPage)}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default Main;
