import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document{
    name: string,
    email: string,
    message: string,
    sent: Date
}

const messageSchema: Schema = new Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	email: {
		type: String,
		required: [true, "Name is required"],
	},
	message: {
		type: String,
		required: [true, "Name is required"],
	},
    date: {
        type: Date,
        default: Date
    }
});

let Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;