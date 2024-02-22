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
const commentRoute = express_1.default.Router();
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
commentRoute.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        console.error(err);
        return res.status(400).send({ status: 400, message: err.message }); // Bad request
    }
    next();
});
// All comments
commentRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let comments = yield commentModel_1.default.find({});
    res.status(200).json(comments);
}));
// Delete Comment
commentRoute.delete("/delete/:", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        let commentId = req.params.id;
        try {
            let del = yield commentModel_1.default.findByIdAndDelete(commentId);
            if (del) {
                res.status(200).json({
                    "message": "Comment deleted"
                });
            }
            else {
                res.status(404).json({
                    "error": "Comment not found"
                });
            }
        }
        catch (error) {
            res.status(404).json({
                error: "Comment not found",
            });
        }
    }
    else {
        res.status(400).json({ "error": "No Id submitted" });
    }
}));
// New comment
commentRoute.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let check = validateComment(req.body);
    if (check.error) {
        res.status(400).json({
            "error": check.error.message
        });
    }
    else {
        let blogId = req.body.blogId;
        try {
            if (yield blogModels_1.default.findById(blogId)) {
                let newComment = yield commentModel_1.default.create(req.body);
                res.status(200).json({
                    "message": "Comment received"
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
