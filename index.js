import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/about", (req, res) => {
  res.status(200).send("About Us");
});

app.post("/contact", (req, res) => {
  res.status(200).send("Contact Us");
});

app.get("/page1.html", (req, res) => {
  res
    .status(200)
    .send("Page 1" + req.socket.remoteAddress + req.socket.remoteFamily);
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
