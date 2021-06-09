import axios, { AxiosInstance } from 'axios'

export const createAxiosClient = (): AxiosInstance => {
  const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return axios.create({
    baseURL: baseUrl || 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

