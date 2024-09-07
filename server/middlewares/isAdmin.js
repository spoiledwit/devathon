import AuthModel from "../models/Auth.js";

export const isAdmin = async (req, res, next) => {
    try {
        const id= req.userId;
        const user = await AuthModel.findById(id);

        if (user.role !== "admin") {
            return res.status(400).json({ error: "Access denied" });
        }

        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}