import express, {NextFunction, Request, Response} from "express";
import Blog, { IBlog } from "../models/blogModels";
import isAdmin from "./isAdmin";
import mongoose from "mongoose";
import Joi from "joi";

function validateBlog(data:object){
	let schema = Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		content: Joi.string().required().min(100)
	})
	return schema.validate(data);
}


const blogsRoute = express.Router();
blogsRoute.use(express.json());

// Handling Invalid JSON

 blogsRoute.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof SyntaxError && "body" in err) {
			console.error(err);
			return res.status(400).send({ status: 400, message: err.message }); // Bad request
		}
		next();
 });

blogsRoute.get("/", async (req: Request, res: Response) => {
	try {
		let blogs: IBlog[] = await Blog.find({}, "_id description title picture");
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
		res.send(404).json({
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
			} else {
				res.status(400).json({
					status: "fail",
					message: "No id provided",
				});
			}
	} catch (error) {
		res.status(500).json({
			"status": "fail",
			"message": "Invalid id provided"
		});
	}
})

// New Blog article

blogsRoute.post("/",isAdmin,async (req: Request, res: Response) => {
	try {
		const blog: IBlog = await Blog.create(req.body);
		res.status(201).json(blog);
	} catch (error: any) {
		console.log(error.message);
		res.status(400).json(error.message);
	}
});

// Update a blog article

blogsRoute.put("/:id",isAdmin, async(req: Request, res: Response)=>{
	try{
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