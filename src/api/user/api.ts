import axiosInstance from '../../util/axiosInstance';
import { SignUpRequest } from './type';

const url = '/user';
const userApi = {
  getUsers: () => axiosInstance.get(''),
  signUp: (request: SignUpRequest) => {
    return axiosInstance.post(`${url}/signUp`, request);
  },
};

export default userApi;
