const { default: axios } = require("axios");

export const BASE_URL = "https://lead-distribution-system-backend.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
