"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uri = exports.port = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
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
const invalidJson_1 = __importDefault(require("./routes/invalidJson"));
const isAdmin_1 = __importDefault(require("./routes/isAdmin"));
const blogModels_1 = __importDefault(require("./models/blogModels"));
const commentModel_1 = __importDefault(require("./models/commentModel"));
const messageModel_1 = __importDefault(require("./models/messageModel"));
// Handling Invalid JSON
app.use(invalidJson_1.default);
// Initialising routes
app.use("/blogs", blogs_1.default);
app.use("/messages", messages_1.default);
app.use("/profile", profile_1.default);
app.use("/comments", comments_1.default);
app.use("/login", login_1.default);
// Mongodb connection string
exports.uri = process.env.MONGODB;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use((0, express_fileupload_1.default)());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({
        "status": "success",
        "message": "Welcome"
    });
});
app.get("/details", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let messages = yield messageModel_1.default.find({});
    let comments = yield commentModel_1.default.find({});
    let blogs = yield blogModels_1.default.find({});
    let details = {
        "blogs": blogs.length,
        "comments": comments.length,
        "messages": messages.length
    };
    res.status(200).json({
        status: "success",
        message: details
    });
}));
app.all("*", (req, res) => {
    res.status(404).json({
        status: "fail",
        message: `Endpoint ${req.url} was not found!`,
    });
});
exports.default = app;
