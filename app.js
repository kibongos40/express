const express = require("express");
const app = express();

var cors = require("cors");

const mongoose = require("mongoose");

const Blog = require("./models/blogModels");

const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
// Default;


app.get("/", (req, res) => {
    console.log("Home");
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
	.connect("mongodb+srv://kibongo:kibongo@cluster0.rtftzhq.mongodb.net/portfolio")
	.then(() => {
		console.log("Connected");
		app.listen(port, () => {
			console.log(`Running on ${port}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});