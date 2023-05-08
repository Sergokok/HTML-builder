// подключаем fs и path
const fs = require('fs');
const path = require('path');

const copyDirectory = (source, destination) => {
  fs.mkdirSync(destination, {recursive: true}); // создаем директорию

  const entries = fs.readdirSync(source, {withFileTypes: true}); // Получаем массив

  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name); // Итерируемся. Путь оттуда сюда.

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    } // если директория и файл то копу=ируем в новое место
  }
};

const source = path.join(__dirname, 'files'); // путь к исходному
const destination = path.join(__dirname, 'files-copy'); // папка копия

copyDirectory(source, destination);
