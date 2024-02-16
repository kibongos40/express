import express, {Request, Response, request} from "express";
import Blog, { IBlog } from "../models/blogModels";
import isAdmin from "./isAdmin";
import mongoose from "mongoose";


const blogRoute = express.Router();
blogRoute.use(express.json());

blogRoute.get("/", async (req: Request, res: Response) => {
	try {
		let blogs: IBlog[] = await Blog.find({}, "_id description title picture");
		res.status(200).json(blogs);
	} catch (error) {
		// Handle error appropriately
	}
});

blogRoute.get("/get/:id", async (req: Request, res: Response) => {
	try {
		let blog = await Blog.findById(req.params.id);
		res.status(200).json(blog);
	} catch (error) {
		res.send(404).json({
            error: "Blog not found"
        });
	}
});



// Processing

blogRoute.delete("/delete/:id?",isAdmin, async(req: Request, res: Response)=>{
    if(req.params.id){
        let bid = req.params.id;
        let deleted = await Blog.findByIdAndDelete(bid);
        if(deleted){
            res.status(200).json({
                message: "Blog Deleted"
            });
        }
        else{
            res.status(404).json({
                error: "Blog not found"
            });
        }
    }
    else{
        res.status(400).json({ error: "No id provided" });
    }
})


blogRoute.post("/add",isAdmin,async (req: Request, res: Response) => {
	try {
		const blog: IBlog = await Blog.create(req.body);
		res.status(200).json(blog);
	} catch (error: any) {
		console.log(error.message);
		res.status(400).json(error.message);
	}
});


export default blogRoute;