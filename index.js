import fs from "fs";
const fileContent = fs.readFileSync("./package.json");
console.log(fileContent.toString());
