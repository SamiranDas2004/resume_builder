import User from "../../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found with this email" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Password is not correct" });
    }

    // Generate the JWT
    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, "foreverloveyou", { expiresIn: '6h' });

    // Return the token in the response JSON (no need for cookies if storing locally)
    return res.status(200).json({ message: "User logged in successfully", user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
