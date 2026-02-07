import { JWT_PASSWORD } from "./config.js";
import jwt from "jsonwebtoken";
export const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header, JWT_PASSWORD);
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({ message: "You are not logged in." });
    }
};
//# sourceMappingURL=middleware.js.map