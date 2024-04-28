import { AxiosInstance } from 'axios';

export const setupInterceptors = (store: any, axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
        config => {
            const token = store.getState().auth.token;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
};
