import axios from './interceptor-axios';
import { API_URL } from '../constants';

function getProfileUserByWalletAddress(ethKey: string) {
  const request = {
    method: 'GET',
    url: `${API_URL}/users/profile/${ethKey}`,
  };

  return axios(request);
}

function updateEkycUser(body) {
  const request = {
    method: 'POST',
    url: `${API_URL}/users/ekyc-submit`,
    data: body,
  };

  return axios(request);
}

function subscriberUser(body) {
  const request = {
    method: 'POST',
    url: `${API_URL}/subscribers`,
    data: body,
  };

  return axios(request);
}

function updateProfileUser(body) {
  const request = {
    method: 'PATCH',
    url: `${API_URL}/users/profile`,
    data: body,
  };

  return axios(request);
}

function checkEkycProfile(ethKey: string) {
  const request = {
    method: 'GET',
    url: `${API_URL}/users/${ethKey}`,
  };

  return axios(request);
}

export {
  getProfileUserByWalletAddress,
  checkEkycProfile,
  updateEkycUser,
  updateProfileUser,
  subscriberUser,
};
