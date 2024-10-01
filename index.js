import express from "express";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

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

app.post("/register", (req, res) => {
  console.log(req.body);
  if (!existsSync("./data.csv"))
    writeFileSync("./data.csv", "Nom,Prénom,Email");
  appendFileSync(
    "./data.csv",
    `\n${req.body.nom},${req.body.prenom},${req.body.email}`
  );
  res.status(200).render("info", req.body);
});

app.get("/users", (req, res) => {
  const csvBuffer = readFileSync("./data.csv");
  const users =
    csvBuffer
      .toString()
      .split("\n")
      .slice(1)
      .map((row) => row.split(","))
      .map(([nom, prenom, email]) => ({ nom, prenom, email }))
  res.status(200).render("users", { users });
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
