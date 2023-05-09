// // модули fs и path
// const fs = require("fs");
// const path = require("path");
//
// // определяем
// const destinationDir = "project-dist";
// const destinationPath = path.join(__dirname, destinationDir);
//
// const sourceDir = "styles";
// const sourcePath = path.join(__dirname, sourceDir);
//
// const componentsDir = "components";
// const componentsPath = path.join(__dirname, componentsDir);
//
// const templateFile = "template.html";
// const templatePath = path.join(__dirname, templateFile);
//
// const assetsDir = "assets";
// const assetsPath = path.join(__dirname, assetsDir);
//
// // создаем директорию project-dist, если нет ee
// if (!fs.existsSync(destinationPath)) {
//   fs.mkdirSync(destinationPath);
// }
//
// // меняем шаблонные теги в template.html на компоненты
// const templateContent = fs.readFileSync(templatePath, "utf-8");
// const componentFiles = fs.readdirSync(componentsPath);
//
// let newContent = templateContent;
// componentFiles.forEach((file) => {
//   if (path.extname(file) === ".html") {
//     const componentName = path.basename(file, ".html");
//     const componentContent = fs.readFileSync(
//       path.join(componentsPath, file),
//       "utf-8"
//     );
//
//     const regexp = new RegExp(`{{${componentName}}}`, "g");
//     newContent = newContent.replace(regexp, componentContent);
//   }
// });
//
// // Сохраняем результат в project-dist/index.html
// fs.writeFileSync(path.join(destinationPath, "index.html"), newContent, "utf-8");
//
// // Собираем стили из папки styles
// const cssFiles = fs.readdirSync(sourcePath).filter((file) => path.extname(file) === ".css");
// let cssContent = "";
//
// for (const file of cssFiles) {
//   const css = fs.readFileSync(path.join(sourcePath, file), "utf-8");
//   cssContent += css;
// }
//
// // Записываем стили в project-dist/style.css
// fs.writeFileSync(path.join(destinationPath, "style.css"), cssContent, "utf-8");
//
// // копируем assets (если нет директории создаем, и так далее как в предыдущем задании)
// function copyDir(src, dest) {
//   if (!fs.existsSync(dest)) {
//     fs.mkdirSync(dest);
//   }
//
//   const entries = fs.readdirSync(src, { withFileTypes: true });
//
//   entries.forEach((entry) => {
//     const sourcePath = path.join(src, entry.name);
//     const destinationPath = path.join(dest, entry.name);
//
//     if (entry.isDirectory()) {
//       copyDir(sourcePath, destinationPath);
//     } else {
//       fs.copyFileSync(sourcePath, destinationPath);
//     }
//   });
// }
//
// copyDir(assetsPath, path.join(destinationPath, "assets"));
// // выводим сообщение
// console.log("Проект собран в директории 'project-dist'...");

// поправил с промисами
const fs = require("fs").promises;
const path = require("path");

const sourceDir = "styles";
const componentsDir = "components";
const templateFile = "template.html";
const assetsDir = "assets";
const destinationDir = "project-dist";
const destinationPath = path.join(__dirname, destinationDir);
const sourcePath = path.join(__dirname, sourceDir);
const componentsPath = path.join(__dirname, componentsDir);
const templatePath = path.join(__dirname, templateFile);
const assetsPath = path.join(__dirname, assetsDir);

 fs.mkdir(destinationPath, { recursive: true })
  .then(() => {
    return Promise.all([
      fs.readFile(templatePath, "utf-8"),
      fs.readdir(componentsPath),
      fs.readdir(sourcePath),
    ]);
  })
  .then(([templateContent, componentFiles, cssFiles]) => {
    // компоненты
    let newContent = templateContent;
    const componentFilePromises = componentFiles.map((file) => {
      if (path.extname(file) === ".html") {
        const componentName = path.basename(file, ".html");
        return fs.readFile(path.join(componentsPath, file), "utf-8").then((componentContent) => {
          const regexp = new RegExp(`{{${componentName}}}`, "g");
          newContent = newContent.replace(regexp, componentContent);
        });
      }
    });
    return Promise.all(componentFilePromises).then(() => {
      return [newContent, cssFiles];
    });
  })
  .then(([newContent, cssFiles]) => {
    // css
    const cssFilePromises = cssFiles
      .filter((file) => path.extname(file) === ".css")
      .map((file) => fs.readFile(path.join(sourcePath, file), "utf-8"));
    return Promise.all(cssFilePromises).then((cssContentArray) => {
      const cssContent = cssContentArray.join("");
      return [newContent, cssContent];
    });
  })
  .then(([newContent, cssContent]) => {
    // пишем в файл index.html
    return fs.writeFile(path.join(destinationPath, "index.html"), newContent, "utf-8").then(() => {
      // пишем css
      return fs.writeFile(path.join(destinationPath, "style.css"), cssContent, "utf-8");
    });
  })
  .then(() => {
    //  копируем assets
    return copyDir(assetsPath, path.join(destinationPath, "assets"));
  })
  .then(() => {
    console.log("Проект собран в директории 'project-dist'...");
  })
  .catch((err) => {
    console.error(err);
  });

function copyDir(src, dest) {
  return fs
    .mkdir(dest, { recursive: true })
    .then(() => {
      return fs.readdir(src, { withFileTypes: true });
    })
    .then((entries) => {
      const promises = entries.map((entry) => {
        const sourcePath = path.join(src, entry.name);
        const destinationPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          return copyDir(sourcePath, destinationPath);
        } else {
          return fs.copyFile(sourcePath, destinationPath);
        }
      });
      return Promise.all(promises);
    });
}
