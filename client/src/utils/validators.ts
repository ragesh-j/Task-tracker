export const validateName = (name: string) =>
  name.trim().length >= 2 ? "" : "Name must be at least 2 characters";

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "" : "Enter a valid email";

export const validatePassword = (password: string) =>
  password.length >= 6 ? "" : "Password must be at least 6 characters";