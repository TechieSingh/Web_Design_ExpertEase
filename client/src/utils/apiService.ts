import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:3000';

/**
 * Creates an Axios instance configured with base settings.
 * Optionally adds an Authorization header if a token is provided.
 * @param token The JWT for authenticating API requests, or null if no token is available.
 * @returns {AxiosInstance}
 */
const createAPIInstance = (token: string | null): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Only add the Authorization header if a token is provided
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return axiosInstance;
};

export default createAPIInstance;
