// // модули и папки и имя для css нового
// const fs = require('fs');
// const path = require('path');
// const sourceDir = 'styles';
// const destinationDir = 'project-dist';
// const filename = 'bundle.css';
//
// // абсолютный путь до исходной и выходной папок
// const sourcePath = path.join(__dirname, sourceDir);
// const destinationPath = path.join(__dirname, destinationDir);
//
// // фильтруем по расширению .css
// const cssFiles = fs.readdirSync(sourcePath)
//   .filter(file => path.extname(file) === '.css');
//
// // собираем и записываем содержимое всех css
// let contentStyle = '';
//
// for (const file of cssFiles) {
//   const css = fs.readFileSync(path.join(sourcePath, file), 'utf-8');
//   contentStyle += css;
// }
//
// // если нет dist создаем папку
// if (!fs.existsSync(destinationPath)) {
//   fs.mkdirSync(destinationPath);
// }
//
// // записываем содержимое в bundle.css в папку dist
// fs.writeFileSync(path.join(destinationPath, filename), contentStyle, 'utf-8');
// // выводим сообщение
// console.log(`${filename} был создан!`);

// ПОПРАВИЛ промисами
const fs = require('fs').promises;
const path = require('path');

const sourceDir = 'styles';
const destinationDir = 'project-dist';
const filename = 'bundle.css';

const sourcePath = path.join(__dirname, sourceDir);
const destinationPath = path.join(__dirname, destinationDir);

let contentStyle = '';

fs.readdir(sourcePath)
  .then(files => files.filter(file => path.extname(file) === '.css'))
  .then(filteredFiles => {
    const promises = filteredFiles.map(file => {
      const filePath = path.join(sourcePath, file);
      return fs.readFile(filePath, 'utf-8')
        .then(css => contentStyle += css);
    });
    return Promise.all(promises);
  })
  .then(() => fs.mkdir(destinationPath).catch(err => {
    if (err.code !== 'EEXIST') throw err;
  }))
  .then(() => fs.writeFile(path.join(destinationPath, filename), contentStyle, 'utf-8'))
  .then(() => console.log(`${filename} был создан!`))
  .catch(err => console.error(err));
