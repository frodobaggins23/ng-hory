// scripts/inject-env.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const apiKey = process.env.API_KEY || "";

const envFiles = [
  path.join(__dirname, "../src/environments/environment.ts"),
  path.join(__dirname, "../src/environments/environment.prod.ts"),
];

envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/API_KEY: '.*'/, `API_KEY: '${apiKey}'`);
    fs.writeFileSync(file, content, "utf8");
    console.log(`Injected API_KEY into ${file}`);
  }
});
