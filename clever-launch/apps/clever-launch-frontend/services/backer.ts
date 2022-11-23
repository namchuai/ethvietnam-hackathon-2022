import axios from './interceptor-axios';
import { API_URL } from '../constants';

function getBacker() {
  const request = {
    method: 'GET',
    url: `${API_URL}/backers`,
  };

  return axios(request);
}

export { getBacker };
