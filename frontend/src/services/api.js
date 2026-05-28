import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL ||
  "https://multimedia-library-app.onrender.com/api";

const TOKEN_KEY = "mml.token";

export const tokenStorage = {
  get:    () => localStorage.getItem(TOKEN_KEY),
  set:    (token) => localStorage.setItem(TOKEN_KEY, token),
  clear:  () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Surface a structured error and dispatch a global event on 401 so that
// the auth provider can react (e.g. log the user out cleanly).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data   = error.response?.data;

    if (status === 401) {
      window.dispatchEvent(new CustomEvent("mml:unauthorized"));
    }

    const message =
      data?.error?.message ||
      data?.message ||
      error.message ||
      "Error de red.";

    const wrapped = new Error(message);
    wrapped.status   = status;
    wrapped.code     = data?.error?.code;
    wrapped.details  = data?.error?.details;
    wrapped.original = error;
    return Promise.reject(wrapped);
  }
);

export default api;
