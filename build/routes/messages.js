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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const isAdmin_1 = __importDefault(require("./isAdmin"));
const invalidJson_1 = __importDefault(require("./invalidJson"));
const cors_1 = __importDefault(require("cors"));
// Router
let messagesRoute = express_1.default.Router();
// Express body parsers
messagesRoute.use((0, cors_1.default)());
messagesRoute.use(express_1.default.json());
messagesRoute.use(express_1.default.urlencoded({
    extended: true
}));
// Joi validate message
function validateMessage(message) {
    let schema = joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        message: joi_1.default.string().required().min(5),
    });
    return schema.validate(message);
}
// Handling Invalid JSON
messagesRoute.use(invalidJson_1.default);
// New Message
function escapeHtml(html) {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
messagesRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let check = validateMessage(req.body);
    if (check.error) {
        res.status(400).json({
            status: "fail",
            error: check.error.message,
        });
    }
    else {
        req.body.name = escapeHtml(req.body.name);
        req.body.email = escapeHtml(req.body.email);
        req.body.message = escapeHtml(req.body.message);
        let message = yield messageModel_1.default.create(req.body);
        res.status(201).json({
            status: "success",
            message: "Your message was received",
            id: message._id
        });
    }
}));
// All messages
messagesRoute.get("/", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let messages = yield messageModel_1.default.find({});
    if (messages.length == 0) {
        return res.status(200).json({
            "status": "fail",
            "message": "No messages found"
        });
    }
    res.json({
        status: "success",
        message: messages,
    });
}));
// Delete a message
messagesRoute.delete("/:id", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (id) {
        if (yield messageModel_1.default.findByIdAndDelete(id)) {
            res.status(200).json({ "status": "success", "message": "Message Deleted" });
        }
        else {
            res
                .status(404)
                .json({ "status": "fail", "message": "Message not found" });
        }
    }
}));
// Default
messagesRoute.all("/", (req, res) => {
    res.json({
        "status": "success", "message": "Messages endpoint",
    });
});
exports.default = messagesRoute;
