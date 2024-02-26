import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { ObjectId } from "mongoose";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import app, {uri, port} from "./app";

let url = process.env.MONGODB_URI;

let api = express();

api.use("/api/v1/", app);

api.all("/",(req: Request, res: Response)=>{
    res.status(301).redirect("/api/v1");
});

mongoose
	.connect(uri as string)
	.then(() => {
		console.log("Connected");
		api.listen(port, () => {
			console.log(`Running on ${port}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
