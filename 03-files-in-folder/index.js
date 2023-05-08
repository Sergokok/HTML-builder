// модули: fs и path
const fs = require('fs/promises');
const path = require('path');
const folderPath = './03-files-in-folder/secret-folder';

fs.readdir(folderPath, { withFileTypes: true }) // читаем содержимое директории
  .then(files => {
    files.forEach(async file => {
      if (file.isFile()) {
        const fileName = file.name;
        const fileExt = path.extname(fileName).slice(1);
        const stats = await fs.stat(`${folderPath}/${fileName}`);
        const fileSize = stats.size;
        console.log(`${fileName} ${fileExt} ${fileSize} bytes`); // получаем имя расширение и данные о файле,размер, сохраняем и выводим в консоли
      }
    });
  })
  .catch(err => console.error(err)); // ловим ошибки
