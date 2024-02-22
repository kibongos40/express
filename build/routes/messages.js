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
// Router
let messagesRoute = express_1.default.Router();
// Express body parsers
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
// Endpoints:
// Handling Invalid JSON
messagesRoute.use((err, req, res, next) => {
    if (err && "body" in err) {
        console.error(err);
        return res.status(400).send({ message: err.message }); // Bad request
    }
    next();
});
// New Message
messagesRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let check = validateMessage(req.body);
    if (check.error) {
        res.json({
            error: check.error.message,
        });
    }
    else {
        let message = yield messageModel_1.default.create(req.body);
        res.json({
            message: "Your message was received",
        });
    }
}));
// All messages
messagesRoute.get("/", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let messages = yield messageModel_1.default.find({});
    if (messages.length == 0) {
        return res.status(404).json({
            "error": "No messages found"
        });
    }
    res.json(messages);
}));
// Delete a message
messagesRoute.get("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    if (id) {
        if (yield messageModel_1.default.findByIdAndDelete(id)) {
            res.status(200).json({ "message": "Message Deleted" });
        }
        else {
            res.status(404).json({ "error": "Message not found" });
        }
    }
}));
// Default
messagesRoute.all("/", (req, res) => {
    res.json({
        message: "Messages endpoint",
    });
});
exports.default = messagesRoute;
