const fs = require('fs');
const fileStream = fs.createReadStream('text.txt');

fileStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

fileStream.on('end', () => {
  console.log('File reading complete.');
});
