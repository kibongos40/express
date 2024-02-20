"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
// Routers
const blogs_1 = __importDefault(require("./routes/blogs"));
// Initialising routes
app.use("/api/blogs", blogs_1.default);
let uri = process.env.MONGODB;
console.clear();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
function checkLogin(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
        });
    }
    next();
}
app.get("/", (req, res) => {
    console.log("Home");
    res.send({
        message: "Welcome to Kibongo Simon Peter's Blog",
    });
});
app.all("*", (req, res) => {
    res.status(404).json({
        message: `Endpoint ${req.url} was not found!`,
    });
});
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("Connected");
    app.listen(port, () => {
        console.log(`Running on ${port}`);
    });
})
    .catch((error) => {
    console.log(error);
});

module.exports = app;