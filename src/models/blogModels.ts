import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
	title: string;
	description: string;
	content: string;
	picture: string;
	createdAt: Date;
	updatedAt: Date;
}

const blogSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Provide a title please"],
		},
		description: {
			type: String,
			required: [true, "Provide a description please"],
		},
		content: {
			type: String,
			required: [true, "Provide content please"],
		},
		picture: {
			type: String,
			required: [true, "Provide a picture please"],
		},
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
