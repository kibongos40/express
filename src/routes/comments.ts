import mongoose from "mongoose";
import Comment, {IComment} from "../models/commentModel";
import express, {NextFunction, Request, Response, Router} from "express"
import Joi from "joi";
import Blog from "../models/blogModels";
import invalidJson from "./invalidJson";
import isAdmin from "./isAdmin";
import cors from "cors";

const commentRoute: Router = express.Router();

commentRoute.use(cors());
commentRoute.use(express.json());
commentRoute.use(express.urlencoded({
    extended: true
}))

function validateComment(data: any){
    let schema = Joi.object().keys({
        userName: Joi.string().required(),
        comment: Joi.string().required(),
        blogId: Joi.string().required()
    });
    return schema.validate(data);
}

// Handling Invalid JSON

 commentRoute.use(invalidJson);

// All comments


commentRoute.get("/", async (req: Request, res: Response) => {
	let comments = await Comment.find({});
	res.status(200).json({
        "status":"success",
        "message": comments
    });
});

// All comments by ID


commentRoute.get("/:id", async (req: Request, res: Response) => {
    try {
        let bid = req.params.id;
        let comments = await Comment.find({blogId: bid});
        res.status(200).json({
					"status": "success",
					"message": comments
				});
    } catch (error){
        res.status(500).json({
            "status":"fail",
            "message":"Invalid Blog ID"
        });
    }
});

// Approve a comment

commentRoute.put("/:id", isAdmin, async(req: Request, res: Response)=>{
    let id = req.params.id;
    try{
        let comment: IComment | null = await Comment.findById(id);
        if(comment){
            comment.approved = !comment.approved;
            let status = comment.approved;
            comment.save();
            res.status(200).json({
                "status": "success",
                "message": `Comment ${status ? 'approved':'denied'}`
            });
        }
        else{
            res.status(404).json({
                "status": "fail",
                "message": "Comment not found"
            });
        }
    }
    catch{
            res.status(500).json({
                "status": "fail",
                "message": "Internal server error"
            });
    }
});


// Delete Comment

commentRoute.delete("/:id",isAdmin, async (req: Request, res: Response) => {
    if(req.params.id){
        let commentId = req.params.id;
        try{
            let del = await Comment.findByIdAndDelete(commentId);
            if(del){
                res.status(200).json({
                    "status":"success",
                    "message":"Comment deleted"
                });
            }
            else{
                res.status(404).json({
                    "status":"fail",
                    "message": "Comment not found"
                });
            }
        }
        catch(error: any){
            res.status(404).json({
                "status":"fail",
                "message": "Comment not found",
            });
        }
    }
    else{
        res.status(400).json({"status":"fail","message":"No Id submitted"});
    }
});

// New comment
function escapeHtml(html: string) {
	return html
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
commentRoute.post("/", async(req: Request, res: Response)=>{
    let check = validateComment(req.body);
    if(check.error){
        res.status(400).json({
            "status":"fail",
            "message": check.error.message
        });
    }
    else{
        let blogId = req.body.blogId;
        req.body.comment = escapeHtml(req.body.comment);
        req.body.userName = escapeHtml(req.body.userName);
        try{
            if(await Blog.findById(blogId)){
                let newComment = await Comment.create(req.body);
                res.status(201).json({
                    "status":"success",
                    "message": "Comment received",
                    "id": newComment._id
                });
            }
            else{
                res.status(400).json({"error": "Blog not found"});
            }
        }
        catch(error:any){
            res.status(400).json({"error": "Blog not found"});
        }
    }
})

export default commentRoute;