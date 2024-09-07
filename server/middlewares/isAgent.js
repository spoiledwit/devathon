import AuthModel from "../models/Auth.js";

export const isAgent = async (req, res, next) => {
    try {
        const id = req.userId;
        const user = await AuthModel.findById(id);

        if (user.role !== "agent") {
            return res.status(400).json({ error: "Access denied" });
        }

        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}