import {login, register, getUser, updateUser, verifyMFA} from "../controllers/Auth.js";
import verifyToken from "../middlewares/verifyToken.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.put("/user", verifyToken, updateUser);
router.post("/verify-mfa", verifyMFA);

export default router;