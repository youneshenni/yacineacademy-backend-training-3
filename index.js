const fs = require("fs");
const fileContent = fs.readFileSync("./package.json");
console.log(fileContent.toString());
