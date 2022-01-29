const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin, stdout } = require('process');
const input = readline.createInterface(stdin, stdout);

console.log('Консольна игра "Орел или решка"');

function getRandomNumber() {
  return Math.round(Math.random()) + 1;
}

function startGame(filePath, fileData) {
  let num = getRandomNumber();

  console.log('Угадайте число: 1 или 2?');

  input.on('line', async (data) => {
    try {
      if (data === '1' || data === '2') {
        const gameCount = fileData.gameCount || 1;
        let wonGameCount = fileData.wonGameCount || 0;
        let lostGameCount = fileData.lostGameCount || 0;

        if (+data === num) {
          wonGameCount++;
          console.log('Вы выйгралии! Еще партию?');
        } else {
          lostGameCount++;
          console.log('Вы проиграли! Еще партию?');
        }

        num = getRandomNumber();
        fileData = {
          gameCount,
          wonGameCount,
          lostGameCount,
          wonProcent: wonGameCount * 100 / (lostGameCount + wonGameCount),
        };

        await fs.promises.writeFile(filePath, JSON.stringify(fileData));
      } else {
        console.error('Неверное значение!');
      }
    } catch (e) {
      console.error('Возникла ошибка. Игра завершена.', e);
      process.exit(-1);
    }
  });
}

input.question('Введите имя файла для логирования результатов каждой партии\n', async (fileName) => {
  try {
    if (fileName) {
      const filePath = path.join(__dirname, fileName);
      const readFileData = await fs.promises.readFile(filePath, 'utf-8');
      let fileData = {};
      if (readFileData) {
        let parsedFileData = JSON.parse(readFileData);
        fileData = parsedFileData || {};
      }
      startGame(filePath, fileData);
    } else {
      throw new Error('Ошибка! Вы не ввели имя файла');
    }
  } catch (e) {
    console.error('Возникла ошибка. Игра завершена.', e);
    process.exit(-1);
  }
});

input.on('error', (e) => {
  console.error(e);
});

input.on('close', () => {
  console.log('Игра завершена!');
});