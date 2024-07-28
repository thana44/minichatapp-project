import axios from "axios";

const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_HOST,
});

axiosIns.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }else{
            window.location.replace('/login')
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    }
);

axiosIns.interceptors.response.use(
    response => response,
    error => {
        if(error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            window.location.replace('/login')
        }
        return Promise.reject(error)
    }
);

export default axiosIns;