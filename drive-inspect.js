const { google } = require('googleapis');
const fs = require('fs');

// Replace with your API key from Google Console
const API_KEY = 'AIzaSyCdLaiY17kbp6NGJl4vNMJC5SiTVvKxB6g';

// Folder ID is required - specify the folder to inspect
const FOLDER_ID = '1MuUHuE3PZd6s9y2x7qM6Ih8eN5c2FoIc';

if (!FOLDER_ID) {
  console.error('Error: FOLDER_ID is required. Please specify a folder ID in the script.');
  process.exit(1);
}

// Initialize the Drive API
const drive = google.drive({
  version: 'v3',
  auth: API_KEY
});

async function inspectFolder() {
  try {
    console.log(`Inspecting folder: ${FOLDER_ID}`);
    console.log('Fetching images from specified folder...\n');
    
    // Search for image files in the specified folder only
    const query = `mimeType contains 'image/' and '${FOLDER_ID}' in parents`;
    
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, size)',
      pageSize: 100 // Get up to 100 images
    });

    const files = response.data.files;
    
    if (files.length === 0) {
      console.log('No images found in the specified folder.');
      return [];
    }

    console.log(`Found ${files.length} images:\n`);
    
    const imageList = [];
    files.forEach((file, index) => {
      const imageInfo = {
        name: file.name,
        id: file.id,
        type: file.mimeType,
        size: file.size ? Math.round(file.size / 1024) + ' KB' : 'Unknown'
      };
      
      imageList.push(imageInfo);
      
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   ID: ${file.id}`);
      console.log(`   Type: ${file.mimeType}`);
      console.log(`   Size: ${imageInfo.size}\n`);
    });

    // Save the list to a JSON file for the download script to use
    const outputFile = 'drive-images.json';
    fs.writeFileSync(outputFile, JSON.stringify(imageList, null, 2));
    console.log(`Image list saved to: ${outputFile}`);

    return imageList;
  } catch (error) {
    console.error('Error inspecting folder:', error.message);
    if (error.code === 403) {
      console.log('\nTip: Make sure your API key is valid and has Google Drive API enabled.');
    }
    return [];
  }
}

// Run the inspection
if (require.main === module) {
  inspectFolder().catch(console.error);
}

module.exports = {
  inspectFolder
};