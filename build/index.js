"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importStar(require("./app"));
let url = process.env.MONGODB_URI;
let api = (0, express_1.default)();
api.use((0, cors_1.default)());
api.use("/api/v1/", app_1.default);
api.use((0, cors_1.default)(), express_1.default.static("public"));
api.all("/", (req, res) => {
    res.status(301).redirect("/api/v1");
});
mongoose_1.default
    .connect(app_1.uri)
    .then(() => {
    console.log("Connected");
    api.listen(app_1.port, () => {
        console.log(`Running on ${app_1.port}`);
    });
})
    .catch((error) => {
    console.log(error);
});
