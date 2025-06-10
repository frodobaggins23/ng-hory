const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Replace with your API key from Google Console
const API_KEY = 'AIzaSyCdLaiY17kbp6NGJl4vNMJC5SiTVvKxB6g';

// Initialize the Drive API
const drive = google.drive({
  version: 'v3',
  auth: API_KEY
});

function loadImageList() {
  const imageListFile = 'drive-images.json';
  
  if (!fs.existsSync(imageListFile)) {
    console.error(`Error: ${imageListFile} not found.`);
    console.log('Please run "node drive-inspect.js" first to generate the image list.');
    return null;
  }

  try {
    const data = fs.readFileSync(imageListFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading image list:', error.message);
    return null;
  }
}

function findImageByName(imageList, searchName) {
  // First try exact match
  let match = imageList.find(img => img.name === searchName);
  
  if (!match) {
    // Try partial match (case-insensitive)
    match = imageList.find(img => 
      img.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }

  return match;
}

async function downloadImage(fileId, fileName) {
  try {
    console.log(`Downloading ${fileName}...`);
    
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'stream' });

    const downloadPath = path.join(__dirname, 'downloads', fileName);
    
    // Create downloads directory if it doesn't exist
    const downloadDir = path.dirname(downloadPath);
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(downloadPath);
    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log(`✓ Downloaded: ${downloadPath}`);
        resolve(downloadPath);
      });
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading image:', error.message);
    throw error;
  }
}

async function downloadByName(imageName) {
  if (!imageName) {
    console.error('Error: Please provide an image name.');
    console.log('Usage: node drive-download.js "image-name"');
    return;
  }

  console.log(`Looking for image: ${imageName}\n`);

  // Load the image list from inspection
  const imageList = loadImageList();
  if (!imageList) {
    return;
  }

  console.log(`Loaded ${imageList.length} images from inspection.`);

  // Find the image
  const imageFile = findImageByName(imageList, imageName);

  if (!imageFile) {
    console.log(`❌ No image found matching: ${imageName}`);
    console.log('\nAvailable images:');
    imageList.forEach((img, index) => {
      console.log(`${index + 1}. ${img.name}`);
    });
    return;
  }

  console.log(`✓ Found: ${imageFile.name}`);
  console.log(`  ID: ${imageFile.id}`);
  console.log(`  Type: ${imageFile.type}`);
  console.log(`  Size: ${imageFile.size}\n`);

  // Download the image
  try {
    await downloadImage(imageFile.id, imageFile.name);
    console.log('\n✓ Download completed successfully!');
  } catch (error) {
    console.log('\n❌ Download failed.');
  }
}

// Main function
async function main() {
  const imageName = process.argv[2];
  await downloadByName(imageName);
}

// Run the download
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  downloadByName,
  loadImageList,
  findImageByName
};