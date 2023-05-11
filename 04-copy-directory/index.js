//  fs и path
const fs = require('fs').promises;
const path = require('path');

// рекурсивно копируем
const copyDirectory = async (source, destination) => {
  // удаляем папку копии если есть такая
  await fs.rm(destination, { recursive: true, force: true });
  // дальше создаем получаем список что в ней есть проходим по списку  составляем пути
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    // +на всякий если папка+ то рекопим папки а иначе файлы
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
};

const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');

copyDirectory(source, destination);
