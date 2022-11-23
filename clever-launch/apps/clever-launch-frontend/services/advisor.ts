import axios from './interceptor-axios';
import { API_URL } from '../constants';

function getListAdvisor(condition) {
  const request = {
    method: 'GET',
    url: `${API_URL}/advisors`,
    params: condition,
  };

  return axios(request);
}

export { getListAdvisor };
