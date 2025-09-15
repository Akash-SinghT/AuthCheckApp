import User from "../models/User.js";
import { validateSignup, validateLogin } from "../utils/validator.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check errors
    const errors = validateSignup(name, email, password);
    if (errors.length) return res.status(400).json({ errors });
    // already a user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user, res);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: user._id, name, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validateLogin(email, password);
    if (errors.length) return res.status(400).json({ errors });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user, res);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  return res.status(200).json({ message: "Logout successful" });
};
