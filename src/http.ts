import axios from 'axios';
import { history } from 'umi';

if(process.env.envTye === 'dev') {
  axios.defaults.baseURL = 'http://localhost:3000'
} else {
  // axios.defaults.baseURL = 'http://10.8.20.137:8081'; //服务器地址
  axios.defaults.baseURL = 'http://localhost:3000'; //服务器地址
}

const instance = axios.create({
  headers: {
    'x-requested-with': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }
})

export default instance;
export const serverUrlRoot = 'http://localhost:3000';
