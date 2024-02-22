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
dotenv_1.default.config();
const loginRoute = express_1.default.Router();
loginRoute.use(express_1.default.json());
loginRoute.use(express_1.default.urlencoded({
    extended: true
}));
// Handling Invalid JSON
loginRoute.use((err, req, res, next) => {
    if (err && "body" in err) {
        console.error(err);
        return res.status(400).send({ message: err.message }); // Bad request
    }
    next();
});
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
                return res.json({
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
                    expiresIn: "30m"
                });
                res.status(200).json({
                    "status": "success",
                    "token": token,
                    "message": "Login successful"
                });
            }
            else {
                return res.json({
                    "error": "No user found"
                });
            }
        }
        else {
            return res.status(403).json({
                "status": "fail",
                "error": "Username and password required"
            });
        }
    }
    catch (_a) {
        res.status(500).json({
            "status": "fail",
            "error": "Server Error"
        });
    }
});
exports.default = loginRoute;
