import axios from 'axios';

const api = axios.create({
  baseURL: 'ttp://172.23.161.60:3333',
});

export default api;
