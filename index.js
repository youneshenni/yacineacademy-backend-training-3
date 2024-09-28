import express from "express";
import { writeFile } from "fs/promises";
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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
  res.status(200).send(req.socket.remoteAddress);
});

app.post("/info", async (req, res) => {
  writeFile("users.json", JSON.stringify(req.body));
  res.status(200).render("info.ejs", req.body);
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
