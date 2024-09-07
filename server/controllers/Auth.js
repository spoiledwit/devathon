import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthModel from "../models/Auth.js";
import dotenv from "dotenv";
import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";
dotenv.config();

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user exists
    const oldUser = await AuthModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exists");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await AuthModel.create({
      name,
      email,
      hashedPassword: encryptedPassword,
      role,
    });

    // Create token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, MFA } = req.body;
    const user = await AuthModel.findById(req.userId);
    if (name) user.name = name;
    if (email) user.email = email;
    if (MFA !== undefined) user.MFA = MFA;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const generateMFACode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }

    if (user.MFA) {
      const mfaCode = generateMFACode();
      user.mfaCode = mfaCode;
      user.mfaCodeExpiry = Date.now() + 600000;
      await user.save();

      await sendEmail({
        email:email,
        subject:"MFA Code",
        text:`Your MFA code is ${mfaCode}. It will expire in 10 minutes.`
    });

      const tempToken = jwt.sign(
        { email: user.email, id: user._id, mfa: true },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );
      return res.status(200).json({ mfaRequired: true, tempToken });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


export const verifyMFA = async (req, res) => {
    try {
      const { mfaCode, tempToken } = req.body;
  
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (!decoded.mfa) {
        return res.status(400).send("Invalid token");
      }
  
      const user = await AuthModel.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      if (user.mfaCode !== mfaCode || user.mfaCodeExpiry < Date.now()) {
        return res.status(400).send("Invalid or expired MFA code");
      }
  
      user.mfaCode = null;
      user.mfaCodeExpiry = null;
      await user.save();
  
      const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "10h" });
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };