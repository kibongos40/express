import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { ObjectId } from "mongoose";

import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();
const app = express();
const port = 3000;

// Routers
import blogsRoute from "./routes/blogs";
import messagesRoute from "./routes/messages"

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

// Mongodb connection string

let uri:any = process.env.MONGODB;

console.clear()


app.use(express.static("public"));
app.use(express.json());
app.use(cors());


app.get("/", (req: Request, res: Response) => {
	console.log("Home");
	res.send({
		message: "Welcome to Kibongo Simon Peter's Blog",
	});
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
	})
	.catch((error) => {
		console.log(error);
	});
