import axios, { AxiosRequestConfig } from 'axios';

const baseURL = 'https://rickandmortyapi.com/api/';

const axiosInstance = axios.create({
    baseURL,
});

export const rnmService = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.request<T>(config);
    return response.data;
};
