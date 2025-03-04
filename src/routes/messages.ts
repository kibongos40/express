import mongoose from "mongoose";
import express, { Router, Request, Response, NextFunction } from "express";
import Joi from "joi";
import Message, { IMessage } from "../models/messageModel";
import isAdmin from "./isAdmin";
import invalidJson from "./invalidJson";
import cors from "cors";

// Router

let messagesRoute: Router = express.Router();

// Express body parsers
messagesRoute.use(cors());
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


// Handling Invalid JSON

 messagesRoute.use(invalidJson);

// New Message
function escapeHtml(html: string) {
	return html
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

messagesRoute.post("/", async (req: Request, res: Response) => {
	let check = validateMessage(req.body);
	if (check.error) {
		res.status(400).json({
			status: "fail",
			error: check.error.message,
		});
	} else {
		req.body.name = escapeHtml(req.body.name);
		req.body.email = escapeHtml(req.body.email);
		req.body.message = escapeHtml(req.body.message);
		let message: IMessage = await Message.create(req.body);
		res.status(201).json({
			status: "success",
			message: "Your message was received",
			id: message._id
		});
	}
});

// All messages

messagesRoute.get("/", isAdmin, async (req: Request, res: Response):Promise<any> => {
	let messages: IMessage[] = await Message.find({});
	if(messages.length == 0){
		return res.status(200).json({
			"status": "fail",
			"message": "No messages found"
		});
	}
	res.json({
		status: "success",
		message: messages,
	});
});

// Delete a message

messagesRoute.delete("/:id",isAdmin, async (req: Request, res: Response) => {
    let id = req.params.id;
    if(id){
        if(await Message.findByIdAndDelete(id)){
            res.status(200).json({"status": "success","message":"Message Deleted"});
        }
        else{
            res
							.status(404)
							.json({ "status": "fail", "message": "Message not found" });
        }
    }
});

// Default
messagesRoute.all("/", (req: Request, res: Response) => {
	res.json({
		"status":"success", "message": "Messages endpoint",
	});
});

export default messagesRoute;
