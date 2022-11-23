import axios from './interceptor-axios';
import { API_URL } from '../constants';

function getListMember(condition) {
  const request = {
    method: 'GET',
    url: `${API_URL}/members`,
    params: condition,
  };

  return axios(request);
}

export { getListMember };
