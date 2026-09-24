import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.errors?.[0]?.message ??
      err.response?.data?.message ??
      "Something went wrong"
    );
  }
  return "Something went wrong";
};