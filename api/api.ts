import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apidFile = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default api;
