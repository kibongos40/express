import mongoose from "mongoose";
import Comment, {IComment} from "../models/commentModel";
import express, {NextFunction, Request, Response, Router} from "express"
import Joi from "joi";
import Blog from "../models/blogModels";

const commentRoute: Router = express.Router();

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

 commentRoute.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof SyntaxError && "body" in err) {
			console.error(err);
			return res.status(400).send({ status: 400, message: err.message }); // Bad request
		}
		next();
 });

// All comments


commentRoute.get("/", async (req: Request, res: Response) => {
	let comments = await Comment.find({});
	res.status(200).json(comments);
});

// Delete Comment

commentRoute.delete("/delete/:", async (req: Request, res: Response) => {
    if(req.params.id){
        let commentId = req.params.id;
        try{
            let del = await Comment.findByIdAndDelete(commentId);
            if(del){
                res.status(200).json({
                    "message":"Comment deleted"
                });
            }
            else{
                res.status(404).json({
                    "error": "Comment not found"
                });
            }
        }
        catch(error: any){
            res.status(404).json({
                error: "Comment not found",
            });
        }
    }
    else{
        res.status(400).json({"error":"No Id submitted"});
    }
});

// New comment

commentRoute.post("/new", async(req: Request, res: Response)=>{
    let check = validateComment(req.body);
    if(check.error){
        res.status(400).json({
            "error": check.error.message
        });
    }
    else{
        let blogId = req.body.blogId
        try{
            if(await Blog.findById(blogId)){
                let newComment = await Comment.create(req.body);
                res.status(200).json({
                    "message": "Comment received"
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