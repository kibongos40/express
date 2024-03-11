import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { ObjectId } from "mongoose";

import fileUpload, {UploadedFile} from "express-fileupload";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();
const app = express();
export const port = 3000;

// Routes

import blogsRoute from "./routes/blogs";
import messagesRoute from "./routes/messages"
import profileRoute from "./routes/profile"
import commentRoute from "./routes/comments";
import loginRoute from "./routes/login";
import invalidJson from "./routes/invalidJson";
import isAdmin from "./routes/isAdmin";
import Blog, { IBlog } from "./models/blogModels";
import Comment, { IComment } from "./models/commentModel";
import Message, { IMessage } from "./models/messageModel";

// Handling Invalid JSON

 app.use(invalidJson);

// Initialising routes

app.use("/blogs", blogsRoute);
app.use("/messages", messagesRoute);
app.use("/profile", profileRoute);
app.use("/comments", commentRoute);
app.use("/login", loginRoute);

// Mongodb connection string

export let uri:any = process.env.MONGODB;



app.use(express.json());
app.use(express.urlencoded())
app.use(fileUpload())
app.use(cors());


app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		"status":"success",
		"message":"Welcome"
	});
});

app.get("/details",isAdmin, async (req: Request, res: Response) => {
	let messages: IMessage[] = await Message.find({});
	let comments: IComment[] = await Comment.find({});
	let blogs: IBlog[] = await Blog.find({});
	let details = {
		"blogs": blogs.length,
		"comments": comments.length,
		"messages": messages.length
	}
	res.status(200).json({
		status: "success",
		message: details
	});
});

app.all("*", (req: Request, res: Response) => {
	res.status(404).json({
		status: "fail",
		message: `Endpoint ${req.url} was not found!`,
	});
});

export default app;