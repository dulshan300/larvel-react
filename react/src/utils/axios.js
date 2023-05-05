import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})


axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`
    return config;
})

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const {response} = error;

    if (response?.status == 401) {
        localStorage.removeItem('ACCESS_TOKEN');
    }

    if(response?.status == 500){
        alert("Ops, Something went wrong.. please try again later");
    }

    throw error;
})

export default axiosClient;
