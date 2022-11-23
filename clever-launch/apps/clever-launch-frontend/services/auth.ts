import { AxiosRequestConfig } from 'axios';
import axios from './interceptor-axios';
import { API_URL } from '../constants';

interface IDataAuthNonce {
  ethKey: string;
}

interface IDataAuthWallet {
  username: string;
  password: string;
}

const postDataAuthNonce = (data: IDataAuthNonce) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/auth/nonce`,
    data: data,
  };

  return axios(request);
};

const postDataAuthWallet = (data: IDataAuthWallet) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/auth/wallet`,
    data: data,
  };

  return axios(request);
};

export { postDataAuthNonce, postDataAuthWallet };
