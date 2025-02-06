import { useState } from 'react';
import UserInfoModal from './UserInfoModal';
import { User } from '../../types/User';
import SkeletonUserList from '../../skeletons/SkeletonUserList';

function UserList({ users, loading }: { users: User[]; loading: boolean }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (loading) return <SkeletonUserList itemsPerPage={12} />;

  const openModal = (user: User) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {users.map((user) => (
          <div
            key={user.email}
            className="bg-white p-4 rounded border hover:border-blue-100 hover:bg-gray-100 cursor-pointer"
            onClick={() => openModal(user)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.picture.large}
                alt={user.name.first}
                className="w-24 h-24 rounded-full object-cover"
              />
              <p className="font-bold text-md">
                {user.name.first} {user.name.last}
              </p>
            </div>
          </div>
        ))}
        {selectedUser && (
          <UserInfoModal selectedUser={selectedUser} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

export default UserList;
