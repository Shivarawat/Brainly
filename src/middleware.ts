import type { NextFunction, Request, Response } from "express"; 
import { JWT_PASSWORD } from "./config.js";
import jwt from "jsonwebtoken";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD) as { id: string };
    if(decoded) {
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({message: "You are not logged in."});
    }
}