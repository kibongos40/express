import express, {NextFunction, Request, Response} from "express";
import Blog, { IBlog } from "../models/blogModels";
import isAdmin from "./isAdmin";
import mongoose from "mongoose";
import Joi, { func, invalid } from "joi";
import invalidJson from "./invalidJson";
import cors from "cors";
import fileUpload, {UploadedFile} from "express-fileupload";
import mimeTypes from "mime-types"
import Comment, {IComment} from "../models/commentModel";

function validateBlog(data:object){
	let schema = Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		content: Joi.string().required().min(5)
	})
	return schema.validate(data);
}


const blogsRoute = express.Router();
blogsRoute.use(express.json());


// Handling Invalid JSON

 blogsRoute.use(invalidJson);

//  CORS and file upload

 blogsRoute.use(cors());
 blogsRoute.use(express.urlencoded({
	extended: true
 }))

 blogsRoute.use(fileUpload());

blogsRoute.get("/", async (req: Request, res: Response) => {
	try {
		let blogs: IBlog[] = await Blog.find({}, "_id description title picture createdAt");
		res.status(200).json({
			"status": "success",
			"message": blogs
		});
	} catch (error) {
		res.status(500).json({
			"status": "fail",
			"message": "Server Error"
		});
	}
});

// Get a single blog

blogsRoute.get("/:id", async (req: Request, res: Response) => {
	try {
		let blog = await Blog.findById(req.params.id);
		res.status(200).json({
			"status": "success",
			"message": blog
		});
	} catch (error) {
		res.status(404).json({
			"status": "fail",
            "message": "Blog not found"
        });
	}
});



// Deleting a blog

blogsRoute.delete("/:id",isAdmin, async(req: Request, res: Response)=>{
	try {
		if (req.params.id) {
				let bid = req.params.id;
				let deleted = await Blog.findByIdAndDelete(bid);
				let comments = await Comment.deleteMany({blogId: bid});
				if(comments){
					console.log("Comments deleted");
				}
				if (deleted) {
					res.status(200).json({
						status: "success",
						message: "Blog Deleted",
					});
				} else {
					res.status(404).json({
						status: "fail",
						message: "Blog not found",
					});
				}
			}
	} catch (error) {
		// Nothing here
	}
})

// New Blog article

function uploadFile(req: Request): string | boolean{
	if(req.files && req.files.picture){
		let file = req.files.picture as UploadedFile;
		let types = ["png", "jpg", "jpeg", "webp", "gif", "heif"];
		let type = mimeTypes.extension(file.mimetype);
		if(types.includes(type as string)){
			let name = Date.now() + "." + type;
			console.log(name);
			file.mv("public/images/blogs/"+name, (err:any)=>{
				console.log(err);
				return false;
			})
			return name;
		}
	}
		return false;
}

blogsRoute.post("/",isAdmin,async (req: Request, res: Response) => {
	try {
		let check = validateBlog(req.body);
		console.log(req.body);
		let picture = uploadFile(req);
		if(picture != false){
			req.body.picture = picture;
		}
		else{
			res.status(400).json({
				status: 'fail',
				message: "Invalid file provided"
			})
		}

		if(!check.error){
			const blog: IBlog = await Blog.create(req.body);
			res.status(201).json({
				status: "success",
				message: blog
			});
		}
		else{
			res.status(400).json({
				"status": "fail",
				"message":check.error.message
			});
		}
	} catch (error: any) {
		console.log(error.message);
		res.status(400).json(error.message);
	}
});

// Update a blog article

blogsRoute.put("/:id",isAdmin, async(req: Request, res: Response)=>{
	try{
		let picture = uploadFile(req);
		let id = req.params.id;
		if(await Blog.findById(id)){
			let blog:IBlog = await Blog.findById(id) as IBlog;
			if(req.body.title && req.body.title.length > 1){
				blog.title = req.body.title;
			}
			if(req.body.description && req.body.description.length > 1){
				blog.description = req.body.description;
			}
			if(req.body.content && req.body.content.length > 1){
				blog.content = req.body.content;
			}
			if (picture != false) {
				req.body.picture = picture;
				blog.picture = picture as string;
			}
			blog.save();
			res.status(200).json({
				"status":"success",
				"message": blog
			})
		}
		else{
			res.status(404).json({
				"status":"fail",
				"message":"Blog not found"
			});
		}
	} catch{
		res.status(400).json({
			"status":"fail",
			"message":"Invalid id provided"
		});
	}
});

export default blogsRoute;