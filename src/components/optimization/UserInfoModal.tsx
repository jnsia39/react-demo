import { User } from '../../types/User';

function UserInfoModal({
  selectedUser,
  closeModal,
}: {
  selectedUser: User;
  closeModal: () => void;
}) {
  console.log('UserInfoModal Rendering');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
      onClick={closeModal}
    >
      <div
        className="relative bg-white py-2 px-8 rounded max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-900 text-4xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <div className="flex items-center space-x-6 my-4">
          <img
            src={selectedUser.picture.large}
            alt={selectedUser.name.first}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <p className="font-semibold text-xl text-gray-900">
              {selectedUser.name.first} {selectedUser.name.last}
            </p>
            <p className="text-gray-600 text-sm">{selectedUser.email}</p>
          </div>
        </div>
        <hr />
        <div className="flex p-4 justify-around">
          <p className="text-gray-800 text-sm">
            <span className="font-semibold">Phone:</span> {selectedUser.phone}
          </p>
          <p className="text-gray-800 text-sm">
            <span className="font-semibold">Cell:</span> {selectedUser.cell}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserInfoModal;
