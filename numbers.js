#!/usr/bin/env node

const readline = require('readline');
const input = readline.createInterface(process.stdin, process.stdout);

const min = Math.round(Math.random() * 100);
const max = min + Math.round(Math.random() * 100);
const reelAnswer = Math.floor(Math.random() * (max - min + 1)) + min;

input.on('line', (input) => {
  if (input == reelAnswer) {
    console.log('Отгадано число', input);
    process.exit(-1);
  }
  if (input < reelAnswer) {
    console.log('Больше');
  } else if (input > reelAnswer) {
    console.log('Меньше');
  }
});

input.on('close', () => console.log('Вы завершили игру'));

console.log(`Загадай число в промежутке от ${min} до ${max}\n`);