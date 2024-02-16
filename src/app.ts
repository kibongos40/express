import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import Blog, { IBlog } from "./models/blogModels";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

// const jwt = require("jsonwebtoken");

dotenv.config();


let uri:any = process.env.MONGODB;

console.clear()

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

function checkLogin(req: Request, res: Response, next: ()=>void){
	if (req.headers.authorization){
		let token: string = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }});
	}
	
	next();
}

let Joptions = { 
	expiresIn: '10h' 
};

async function token(){
	let tok= await jwt.sign({"hello": "hi"}, "sample", Joptions);
	console.log(tok);
} 


app.get("/", (req: Request, res: Response) => {
	console.log("Home");
	res.send({
		message: "Welcome to Kibongo Simon Peter's Blog",
	});
});

app.get("/blogs", async (req: Request, res: Response) => {
	try {
		let blogs: IBlog[] = await Blog.find({}, "_id description title picture");
		res.status(200).json(blogs);
	} catch (error) {
		// Handle error appropriately
	}
});


app.post("/blogs/add",checkLogin, async (req: Request, res: Response) => {
	try {
		const blog: IBlog = await Blog.create(req.body);
		res.status(200).json(blog);
	} catch (error: any) {
		console.log(error.message);
		res.status(400).json(error.message);
	}
});

app.all("*", (req: Request, res: Response) => {
	res.status(404).json({
		message: `Endpoint ${req.url} was not found!`,
	});
});

mongoose
	.connect(uri)
	.then(() => {
		console.log("Connected");
		app.listen(port, () => {
			console.log(`Running on ${port}`);
		});
		token();
	})
	.catch((error) => {
		console.log(error);
	});
