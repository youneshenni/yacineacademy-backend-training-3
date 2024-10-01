import express from "express";
import { appendFileSync, existsSync, writeFileSync } from "fs";

const app = express();

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
  res
    .status(200)
    .send("Page 1" + req.socket.remoteAddress + req.socket.remoteFamily);
});
app.post("/register", (req, res) => {
  console.log(req.body);
  if (!existsSync("./data.csv"))
    writeFileSync("./data.csv", "Nom,Prénom,Email\n");
  appendFileSync(
    "./data.csv",
    `${req.body.nom},${req.body.prenom},${req.body.email}\n`
  );
  res.status(200).send("User registered successfully");
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
