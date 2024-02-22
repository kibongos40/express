import mongoose from "mongoose";
import express, { Router, Request, Response, NextFunction } from "express";
import Joi from "joi";
import Message, { IMessage } from "../models/messageModel";
import isAdmin from "./isAdmin";

// Router

let messagesRoute: Router = express.Router();

// Express body parsers

messagesRoute.use(express.json());
messagesRoute.use(express.urlencoded({
	extended: true
}));

// Joi validate message

function validateMessage(message: object) {
	let schema = Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		message: Joi.string().required().min(5),
	});
	return schema.validate(message);
}

// Endpoints:
// Handling Invalid JSON

 messagesRoute.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err && "body" in err) {
			console.error(err);
			return res.status(400).send({ message: err.message }); // Bad request
		}
		next();
 });
// New Message

messagesRoute.post("/", async (req: Request, res: Response) => {
	let check = validateMessage(req.body);
	if (check.error) {
		res.json({
			error: check.error.message,
		});
	} else {
		let message: IMessage = await Message.create(req.body);
		res.json({
			message: "Your message was received",
		});
	}
});

// All messages

messagesRoute.get("/", isAdmin, async (req: Request, res: Response) => {
	let messages: IMessage[] = await Message.find({});
	if(messages.length == 0){
		return res.status(404).json({
			"error": "No messages found"
		});
	}
	res.json(messages);
});

// Delete a message

messagesRoute.get("/delete/:id", async (req: Request, res: Response) => {
    let id = req.params.id;
    if(id){
        if(await Message.findByIdAndDelete(id)){
            res.status(200).json({"message":"Message Deleted"});
        }
        else{
            res.status(404).json({"error":"Message not found"});
        }
    }
});

// Default
messagesRoute.all("/", (req: Request, res: Response) => {
	res.json({
		message: "Messages endpoint",
	});
});

export default messagesRoute;
