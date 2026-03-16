import axios from "axios";

const API = axios.create({
  baseURL: "https://multimedia-library-app.onrender.com/api"
});

export default API;