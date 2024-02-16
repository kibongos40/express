import express, { Request, Response } from "express";
import cors from "cors";
import mongoose, { ObjectId } from "mongoose";

import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();
const app = express();
const port = 3000;

// Routers
import blogRoute from "./routes/blogs";

// Initialising routes
app.use("/blogs", blogRoute);

let uri:any = process.env.MONGODB;

console.clear()


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
