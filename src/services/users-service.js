/**

* @jest-environment node

*/
import axios from "axios";
// change this to point to your server on Heroku
const BASE_URL = "https://cs5500a3node.herokuapp.com/api";
//const BASE_URL = "https://cs5500-01-sp22.herokuapp.com/api";

const USERS_API = `${BASE_URL}/users`;
const LOGIN_API = `${BASE_URL}/login`;

export const createUser = (user) => axios.post(`${USERS_API}`, user)
    .then(response => response.data);

export const findAllUsers = () => axios.get(USERS_API)
    .then(response => response.data);

export const findUserById = (uid) => axios.get(`${USERS_API}/${uid}`)
    .then(response => response.data);

export const deleteUser = (uid) => axios.delete(`${USERS_API}/${uid}`)
    .then(response => response.data);

export const deleteUsersByUsername = (username) =>
  axios.get(`${USERS_API}/username/${username}/delete`)
    .then(response => response.data);

export const findUserByCredentials = (credentials) =>
  axios.post(`${LOGIN_API}`, credentials)
    .then(response => response.data);

