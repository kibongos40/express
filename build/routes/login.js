"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
const sha256_1 = __importDefault(require("sha256"));
const invalidJson_1 = __importDefault(require("./invalidJson"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const loginRoute = express_1.default.Router();
loginRoute.use((0, cors_1.default)());
loginRoute.use(express_1.default.json());
loginRoute.use(express_1.default.urlencoded({
    extended: true
}));
// Handling Invalid JSON
loginRoute.use(invalidJson_1.default);
function validateUser(data) {
    let schema = joi_1.default.object().keys({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    });
    return schema.validate(data);
}
loginRoute.post("/", (req, res) => {
    try {
        if (req.body) {
            let check = validateUser(req.body);
            if (check.error) {
                return res.status(400).json({
                    "status": "fail",
                    "message": check.error.message
                });
            }
            let username = req.body.username;
            let password = (0, sha256_1.default)(req.body.password);
            let users = JSON.parse(process.env.USERS || '[]');
            let user = users.find(auser => auser.username === username && auser.password === password);
            if (user) {
                let payload = {
                    "id": user.id,
                    "user": username
                };
                let token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "2h"
                });
                res.status(200).json({
                    "status": "success",
                    "token": token,
                    "message": "Login successful"
                });
            }
            else {
                return res.json({
                    "status": "fail",
                    "message": "Invalid username or Password"
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            "status": "fail",
            "error": "error"
        });
    }
});
exports.default = loginRoute;
