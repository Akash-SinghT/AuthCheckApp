export const validateSignup = (name, email, password) => {
  const errors = [];
  if (!name || name.length < 3)
    errors.push("Name must be at least 3 characters");

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) errors.push("Invalid email");

  if (!password || password.length < 5)
    errors.push("Password must be at least 5 characters");

  return errors;
};

export const validateLogin = (email, password) => {
  const errors = [];
  if (!email || !password) errors.push("Email and password are required");
  return errors;
};
