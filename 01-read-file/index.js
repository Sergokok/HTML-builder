const fs = require('fs');
const fileStream = fs.createReadStream('01-read-file/text.txt');

fileStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

fileStream.on('end', () => {
  console.log('File reading complete.');
});
