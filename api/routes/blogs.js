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
const blogModels_1 = __importDefault(require("../models/blogModels"));
const isAdmin_1 = __importDefault(require("./isAdmin"));
const blogRoute = express_1.default.Router();
blogRoute.use(express_1.default.json());
blogRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blogs = yield blogModels_1.default.find({}, "_id description title picture");
        res.status(200).json(blogs);
    }
    catch (error) {
        // Handle error appropriately
    }
}));
blogRoute.get("/get/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blog = yield blogModels_1.default.findById(req.params.id);
        res.status(200).json(blog);
    }
    catch (error) {
        res.send(404).json({
            error: "Blog not found"
        });
    }
}));
// Processing
blogRoute.delete("/delete/:id?", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        let bid = req.params.id;
        let deleted = yield blogModels_1.default.findByIdAndDelete(bid);
        if (deleted) {
            res.status(200).json({
                message: "Blog Deleted"
            });
        }
        else {
            res.status(404).json({
                error: "Blog not found"
            });
        }
    }
    else {
        res.status(400).json({ error: "No id provided" });
    }
}));
blogRoute.post("/add", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blogModels_1.default.create(req.body);
        res.status(200).json(blog);
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
    }
}));
exports.default = blogRoute;
