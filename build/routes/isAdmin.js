"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
function isAdmin(req, res, next) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            if (!jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET)) {
                return res.status(401).json({
                    "status": "fail",
                    "message": "Invalid token"
                });
            }
            next();
        }
        else {
            console.log("Unauthorised");
            res.status(401).json({ "status": "fail", "message": "Unauthorised" });
        }
    }
    catch (_a) {
        res.status(403).json({
            "status": "fail",
            "message": "Invalid token"
        });
    }
}
exports.default = isAdmin;
