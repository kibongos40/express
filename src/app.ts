import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { ObjectId } from "mongoose";

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

// Handling Invalid JSON

 app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof SyntaxError && "body" in err) {
			console.error(err);
			return res.status(400).send({ status: 400, message: err.message }); // Bad request
		}
		next();
 });

// Initialising routes

app.use("/blogs", blogsRoute);
app.use("/messages", messagesRoute);
app.use("/profile", profileRoute);
app.use("/comments", commentRoute);
app.use("/login", loginRoute);

// Mongodb connection string

export let uri:any = process.env.MONGODB;


app.use("/ftp",express.static("public"));
app.use(express.json());
app.use(cors());


app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		"status":"success",
		"message":"Welcome"
	});
});


app.all("*", (req: Request, res: Response) => {
	res.status(404).json({
		message: `Endpoint ${req.url} was not found!`,
	});
});


export default app;