//
// // импортируем модуль fs
// const fs = require('fs');
//
// // приветствие
// console.log("ПРИВЕТ! Введите текст:");
//
// // поток для чтения ввода в терминале
// const stdin = process.openStdin();
//
// // чтение ввода и дописывание в файл новго текста
// stdin.addListener('data', function(user_input) {
//   // чтение содержимого файла
//   fs.readFile('02-write-file/out-text.txt', 'utf8', function(err, data) {
//     if(err) {
//       console.log(err);
//     } else {
//       // дополнение в файл нового текста и запись
//       const updated_data = data + "\n" + user_input.toString().trim();
//       fs.writeFile('02-write-file/out-text.txt', updated_data, function(err) {
//         if(err) {
//           console.log(err);
//         } else {
//           console.log("Новый текст был успешно дополнен в файл out-text.txt");
//           console.log("Введите еще текст:");
//         }
//       });
//     }
//   });
//   // обработка exit
//   if(user_input.toString().trim() === 'exit') {
//     console.log("Процесс завершен.");
//     process.exit();
//   }
// });
// // при нажатии Ctrl + C
// process.on('SIGINT', function() {
//   console.log("\nПроцесс завершен.");
//   process.exit();
//
// });
const fs = require('fs');
console.log("ПРИВЕТ! Введите текст:");
const stdin = process.openStdin();
stdin.addListener('data', function(user_input) {
  fs.writeFile('02-write-file/out-text.txt', user_input.toString().trim(), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Новый текст был успешно записан в файл out-text.txt");
      console.log("Введите еще текст:");
    }
  });
});
process.on('SIGINT', function() {
  console.log("\nПроцесс завершен.");
  process.exit();
});
