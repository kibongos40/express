import mongoose, { Schema, Document } from "mongoose"

export interface IComment extends Document {
    blogId: string,
    userName: string,
    comment: string,
    dateCommented: Date
}

const CommentSchema: Schema = new Schema({
    blogId:{
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    dateCommented:{
        type: Date,
        default: Date()
    }
});

const Comment = mongoose.model<IComment>("Comment",CommentSchema);


export default Comment;