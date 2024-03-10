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
const joi_1 = __importDefault(require("joi"));
const invalidJson_1 = __importDefault(require("./invalidJson"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mime_types_1 = __importDefault(require("mime-types"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
function validateBlog(data) {
    let schema = joi_1.default.object().keys({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        content: joi_1.default.string().required().min(5)
    });
    return schema.validate(data);
}
const blogsRoute = express_1.default.Router();
blogsRoute.use(express_1.default.json());
// Handling Invalid JSON
blogsRoute.use(invalidJson_1.default);
//  CORS and file upload
blogsRoute.use((0, cors_1.default)());
blogsRoute.use(express_1.default.urlencoded({
    extended: true
}));
blogsRoute.use((0, express_fileupload_1.default)());
blogsRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blogs = yield blogModels_1.default.find({}, "_id description title picture createdAt");
        res.status(200).json({
            "status": "success",
            "message": blogs
        });
    }
    catch (error) {
        res.status(500).json({
            "status": "fail",
            "message": "Server Error"
        });
    }
}));
// Get a single blog
blogsRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blog = yield blogModels_1.default.findById(req.params.id);
        res.status(200).json({
            "status": "success",
            "message": blog
        });
    }
    catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": "Blog not found"
        });
    }
}));
// Deleting a blog
blogsRoute.delete("/:id", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.id) {
            let bid = req.params.id;
            let deleted = yield blogModels_1.default.findByIdAndDelete(bid);
            let comments = yield commentModel_1.default.deleteMany({ blogId: bid });
            if (comments) {
                console.log("Comments deleted");
            }
            if (deleted) {
                res.status(200).json({
                    status: "success",
                    message: "Blog Deleted",
                });
            }
            else {
                res.status(404).json({
                    status: "fail",
                    message: "Blog not found",
                });
            }
        }
    }
    catch (error) {
        // Nothing here
    }
}));
// New Blog article
function uploadFile(req) {
    if (req.files && req.files.picture) {
        let file = req.files.picture;
        let types = ["png", "jpg", "jpeg", "webp", "gif", "heif"];
        let type = mime_types_1.default.extension(file.mimetype);
        if (types.includes(type)) {
            let name = Date.now() + "." + type;
            console.log(name);
            file.mv("public/images/blogs/" + name, (err) => {
                console.log(err);
                return false;
            });
            return name;
        }
    }
    return false;
}
blogsRoute.post("/", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let check = validateBlog(req.body);
        console.log(req.body);
        let picture = uploadFile(req);
        if (picture != false) {
            req.body.picture = picture;
        }
        else {
            res.status(400).json({
                status: 'fail',
                message: "Invalid file provided"
            });
        }
        if (!check.error) {
            const blog = yield blogModels_1.default.create(req.body);
            res.status(201).json({
                status: "success",
                message: blog
            });
        }
        else {
            res.status(400).json({
                "status": "fail",
                "message": check.error.message
            });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
    }
}));
// Update a blog article
blogsRoute.put("/:id", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let picture = uploadFile(req);
        let id = req.params.id;
        if (yield blogModels_1.default.findById(id)) {
            let blog = yield blogModels_1.default.findById(id);
            if (req.body.title && req.body.title.length > 1) {
                blog.title = req.body.title;
            }
            if (req.body.description && req.body.description.length > 1) {
                blog.description = req.body.description;
            }
            if (req.body.content && req.body.content.length > 1) {
                blog.content = req.body.content;
            }
            if (picture != false) {
                req.body.picture = picture;
                blog.picture = picture;
            }
            blog.save();
            res.status(200).json({
                "status": "success",
                "message": blog
            });
        }
        else {
            res.status(404).json({
                "status": "fail",
                "message": "Blog not found"
            });
        }
    }
    catch (_a) {
        res.status(400).json({
            "status": "fail",
            "message": "Invalid id provided"
        });
    }
}));
exports.default = blogsRoute;
