"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uri = exports.port = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.port = 3000;
// Routes
const blogs_1 = __importDefault(require("./routes/blogs"));
const messages_1 = __importDefault(require("./routes/messages"));
const profile_1 = __importDefault(require("./routes/profile"));
const comments_1 = __importDefault(require("./routes/comments"));
const login_1 = __importDefault(require("./routes/login"));
// Handling Invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        console.error(err);
        return res.status(400).send({ status: 400, message: err.message }); // Bad request
    }
    next();
});
// Initialising routes
app.use("/blogs", blogs_1.default);
app.use("/messages", messages_1.default);
app.use("/profile", profile_1.default);
app.use("/comments", comments_1.default);
app.use("/login", login_1.default);
// Mongodb connection string
exports.uri = process.env.MONGODB;
app.use("/ftp", express_1.default.static("public"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({
        "status": "success",
        "message": "Welcome"
    });
});
app.all("*", (req, res) => {
    res.status(404).json({
        message: `Endpoint ${req.url} was not found!`,
    });
});
exports.default = app;
