const express = require("express");

const app = express();
const port = 100;

app.use(express.static("public"));

// Default
console.clear();

app.get("/", (req,res)=>{
    res.send("<h1>Murife Don't run, you've arrived</h1>");
})

app.get("*", (req,res)=>{
    res.send("<h1>Error 404: Page not found</h1>");
})


app.listen(port, ()=>{
    console.log(`Running on ${port}`);
});