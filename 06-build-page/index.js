// модули fs и path
const fs = require("fs");
const path = require("path");

// определяем
const destinationDir = "project-dist";
const destinationPath = path.join(__dirname, destinationDir);

const sourceDir = "styles";
const sourcePath = path.join(__dirname, sourceDir);

const componentsDir = "components";
const componentsPath = path.join(__dirname, componentsDir);

const templateFile = "template.html";
const templatePath = path.join(__dirname, templateFile);

const assetsDir = "assets";
const assetsPath = path.join(__dirname, assetsDir);

// создаем директорию project-dist, если нет ee
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath);
}

// меняем шаблонные теги в template.html на компоненты
const templateContent = fs.readFileSync(templatePath, "utf-8");
const componentFiles = fs.readdirSync(componentsPath);

let newContent = templateContent;
componentFiles.forEach((file) => {
  if (path.extname(file) === ".html") {
    const componentName = path.basename(file, ".html");
    const componentContent = fs.readFileSync(
      path.join(componentsPath, file),
      "utf-8"
    );

    const regexp = new RegExp(`{{${componentName}}}`, "g");
    newContent = newContent.replace(regexp, componentContent);
  }
});

// Сохраняем результат в project-dist/index.html
fs.writeFileSync(path.join(destinationPath, "index.html"), newContent, "utf-8");

// Собираем стили из папки styles
const cssFiles = fs.readdirSync(sourcePath).filter((file) => path.extname(file) === ".css");
let cssContent = "";

for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(sourcePath, file), "utf-8");
  cssContent += css;
}

// Записываем стили в project-dist/style.css
fs.writeFileSync(path.join(destinationPath, "style.css"), cssContent, "utf-8");

// копируем assets (если нет директории создаем, и так далее как в предыдущем задании)
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach((entry) => {
    const sourcePath = path.join(src, entry.name);
    const destinationPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

copyDir(assetsPath, path.join(destinationPath, "assets"));
// выводим сообщение
console.log("Проект собран в директории 'project-dist'...");
