// scripts/inject-env.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const mapApiKey = process.env.API_KEY || '';
const fileServerHost = process.env.FILE_SERVER_HOST || '';

console.log('mapApiKey:', mapApiKey);

const envFiles = [
  path.join(__dirname, '../src/environments/environment.ts'),
  path.join(__dirname, '../src/environments/environment.prod.ts'),
];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/mapApiKey: '.*'/, `mapApiKey: '${mapApiKey}'`);
    content = content.replace(/fileServerHost: '.*'/, `fileServerHost: '${fileServerHost}'`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected secrets into ${file}`);
  }
});
