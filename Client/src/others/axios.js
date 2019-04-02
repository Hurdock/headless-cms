import axios from 'axios';

var axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/',
  timeout: 10000
  /* other custom settings */
});

export default axiosInstance;