import { AxiosRequestConfig } from 'axios';
import axios from './interceptor-axios';
import { API_URL } from '../constants';

interface IDataDonate {
  transactionHash: string;
  projectId: string;
  amount: number;
  rewardId: string;
}

const postDonateReward = (data: IDataDonate) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/transactions`,
    data: data,
  };

  return axios(request);
};

export { postDonateReward };
