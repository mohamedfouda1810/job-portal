import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosIntance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        'Content-Type': 'application/json',
        Accept:'application/json'
    }
})




// Request Intercreptor
axiosIntance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;

        }
        return config
    },
    (error)=>{
        return Promise.reject(error);

    }
)


//  Response Intercreptor
axiosIntance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {


        //  Handle commn errors 
        if (error.response) {
                   if (error.response.status === 401) {
            // Redirect to login Page 
            window.location.href="/"
        } else if(error.response.status === 500){
            console.error('Server error, Please try again later ')
        }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request Timeout , Please try again later ')
            
            
        }
        return Promise.reject(error);
    }
)

export default axiosIntance;
