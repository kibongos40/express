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
const commentModel_1 = __importDefault(require("../models/commentModel"));
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const blogModels_1 = __importDefault(require("../models/blogModels"));
const invalidJson_1 = __importDefault(require("./invalidJson"));
const isAdmin_1 = __importDefault(require("./isAdmin"));
const cors_1 = __importDefault(require("cors"));
const commentRoute = express_1.default.Router();
commentRoute.use((0, cors_1.default)());
commentRoute.use(express_1.default.json());
commentRoute.use(express_1.default.urlencoded({
    extended: true
}));
function validateComment(data) {
    let schema = joi_1.default.object().keys({
        userName: joi_1.default.string().required(),
        comment: joi_1.default.string().required(),
        blogId: joi_1.default.string().required()
    });
    return schema.validate(data);
}
// Handling Invalid JSON
commentRoute.use(invalidJson_1.default);
// All comments
commentRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let comments = yield commentModel_1.default.find({});
    res.status(200).json({
        "status": "success",
        "message": comments
    });
}));
// All comments by ID
commentRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bid = req.params.id;
        let comments = yield commentModel_1.default.find({ blogId: bid });
        res.status(200).json({
            "status": "success",
            "message": comments
        });
    }
    catch (error) {
        res.status(500).json({
            "status": "fail",
            "message": "Invalid Blog ID"
        });
    }
}));
// Approve a comment
commentRoute.put("/:id", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        let comment = yield commentModel_1.default.findById(id);
        if (comment) {
            comment.approved = !comment.approved;
            let status = comment.approved;
            comment.save();
            res.status(200).json({
                "status": "success",
                "message": `Comment ${status ? 'approved' : 'denied'}`
            });
        }
        else {
            res.status(404).json({
                "status": "fail",
                "message": "Comment not found"
            });
        }
    }
    catch (_a) {
        res.status(500).json({
            "status": "fail",
            "message": "Internal server error"
        });
    }
}));
// Delete Comment
commentRoute.delete("/:id", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        let commentId = req.params.id;
        try {
            let del = yield commentModel_1.default.findByIdAndDelete(commentId);
            if (del) {
                res.status(200).json({
                    "status": "success",
                    "message": "Comment deleted"
                });
            }
            else {
                res.status(404).json({
                    "status": "fail",
                    "message": "Comment not found"
                });
            }
        }
        catch (error) {
            res.status(404).json({
                "status": "fail",
                "message": "Comment not found",
            });
        }
    }
    else {
        res.status(400).json({ "status": "fail", "message": "No Id submitted" });
    }
}));
// New comment
function escapeHtml(html) {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
commentRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let check = validateComment(req.body);
    if (check.error) {
        res.status(400).json({
            "status": "fail",
            "message": check.error.message
        });
    }
    else {
        let blogId = req.body.blogId;
        req.body.comment = escapeHtml(req.body.comment);
        req.body.userName = escapeHtml(req.body.userName);
        try {
            if (yield blogModels_1.default.findById(blogId)) {
                let newComment = yield commentModel_1.default.create(req.body);
                res.status(201).json({
                    "status": "success",
                    "message": "Comment received",
                    "id": newComment._id
                });
            }
            else {
                res.status(400).json({ "error": "Blog not found" });
            }
        }
        catch (error) {
            res.status(400).json({ "error": "Blog not found" });
        }
    }
}));
exports.default = commentRoute;
