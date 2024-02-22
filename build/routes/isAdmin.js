"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function isAdmin(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        if (token == process.env.ADMIN)
            next();
        else
            res.status(401).json({
                error: "Invalid token"
            });
    }
    else {
        console.log("Unauthorised");
        res.status(423).json({ error: "Unauthorised" });
    }
}
exports.default = isAdmin;
