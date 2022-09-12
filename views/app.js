const express = require('express');

const app = express();

app.use(express.static("public"));

app.listen(2100, () => {
  console.log("Server started on port 2100");
})

// HOME/INDEX ROUTE
app.get("/", (req, res) => {
  res.sendFile(__dirname+"/index.html");
})

// ABOUT ROUTE
app.get("/about", (req, res) => {
  res.sendFile(__dirname+"/about.html");
})

// CONTACT ROUTE
app.get("/contact", (req, res) => {
  res.sendFile(__dirname+"/contact.html");
})

// MISSION ROUTE
app.get("/mission", (req, res) => {
  res.sendFile(__dirname+"/mission.html");
})

// ORDER ROUTE
app.get("/order", (req, res) => {
  res.sendFile(__dirname+"/order.html");
})
