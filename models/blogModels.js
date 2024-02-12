const mongoose = require("mongoose");

let blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Provide a title please"]
    },
    description:{
        type: String,
        required: [true, "Provide a description please"],
    },
    content:{
        type: String,
        required: [true, "Provide content please"]
    },
    picture:{
        type: String,
        required: [true, "Provide a picture please"]
    }
},
{
    timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;