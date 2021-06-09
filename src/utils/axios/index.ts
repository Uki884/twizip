import axios, { AxiosInstance } from 'axios'

export const createAxiosClient = (): AxiosInstance => {
  const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  return axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

