// scripts/inject-env.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const apiKey = process.env.API_KEY || "";
const cdnFolder = process.env.CDN_FOLDER || "";
const googleDriveApiKey = process.env.GOOGLE_DRIVE_API_KEY || "";

const envFiles = [
  path.join(__dirname, "../src/environments/environment.ts"),
  path.join(__dirname, "../src/environments/environment.prod.ts"),
];

envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/apiKey: '.*'/, `apiKey: '${apiKey}'`);
    content = content.replace(/cdnFolder: '.*'/, `cdnFolder: '${cdnFolder}'`);
    content = content.replace(/googleDriveApiKey: '.*'/, `googleDriveApiKey: '${googleDriveApiKey}'`);
    fs.writeFileSync(file, content, "utf8");
    console.log(`Injected secrets into ${file}`);
  }
});
