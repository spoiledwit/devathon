import OTPModel from "../models/OTP.js";
import { sendEmail } from "../utils/sendEmail.js";

// Generate OTP
export const generateOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000);

        const expiry = new Date(new Date().getTime() + 5 * 60000);

        const userOTP = await OTPModel.findOne({ email });

        if (userOTP) {
            userOTP.otp = otp;
            userOTP.expiry = expiry;
            await userOTP.save();
        } else {
            await OTPModel.create({ email, otp, expiry });
        }

        await sendEmail({
            to: email,
            subject: "OTP Confirmation Code",
            text: `OTP: ${otp}`
        });

        res.status(200).json({ email });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const userOTP = await OTPModel.findOne({ email });

        if (!userOTP) {
            return res.status(400).json({ error: "OTP not generated" });
        }

        if (userOTP.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        if (new Date() > userOTP.expiry) {
            return res.status(400).json({ error: "OTP expired" });
        }

        await OTPModel.findByIdAndDelete(userOTP._id);

        res.status(200).json({ verifiied: true, message: "OTP verified" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}