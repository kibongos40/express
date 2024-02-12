const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Blog = require("./models/blogModels");

const port = 100;

app.use(express.static("public"));
app.use(express.json());

// Default;


app.get("/", (req, res) => {
    res.send({
        message: "Welcome to Kibongo Simon Peter's Blog"
    });
})

// Get all blogs

app.get("/blogs", async (req, res) => {
    try {
        let blogs = await Blog.find({}, "_id description title picture");
        res.status(200).json(blogs);
    } catch (error) {
    }
})

// New blog

app.post("/blogs/add", async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(200).json(blog);
    } catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
    }
})

app.all("*", (req, res) => {
    res.status(404).json({
        message: `Endpoint ${req.url} was not found!`
    });
})


// Last Line
console.clear();
mongoose
    .connect("mongodb://127.0.0.1:27017/portfolio")
    .then(() => {
        console.log("Connected");
        app.listen(port, () => {
            console.log(`Running on ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });