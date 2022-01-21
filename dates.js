#!/usr/bin/env node

const moment = require('moment');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const pullOperation = () => {
  const argv = yargs(hideBin(process.argv)).argv;
  const curDate = moment();
  const attributes = ['y', 'year', 'd', 'date', 'm', 'month'];
  const commands = {
    'current': (processDate = curDate, { dateAttribut }) => {
      if (!dateAttribut) return curDate.toISOString();

      if (attributes.includes(dateAttribut)) {
        switch (dateAttribut) {
          case 'y':
          case 'year':
            return processDate.year();

          case 'd':
          case 'date':
            return processDate.date();

          case 'm':
          case 'month':
            return processDate.month();
        }
      }

      throw new Error('Неверная команда');
    },
    'add': (processDate = curDate, { dateAttribut, dateVal}) => {
      if (attributes.includes(dateAttribut)) {
        return processDate.add(dateVal, dateAttribut).toISOString();
      }
      throw new Error('Неверная команда');
    },
    'sub': (processDate = curDate, { dateAttribut, dateVal}) => {
      if (attributes.includes(dateAttribut)) {
        return processDate.subtract(dateVal, dateAttribut).toISOString();
      }
      throw new Error('Неверная команда');
    },
  };

  if (argv['_'].length) {
    let result;

    if (argv['_'].length === 1) {
      const arg = argv['_'][0];

      if (arg && arg in commands) {
        if (Object.keys(argv).length > 2) {
          Object.entries(argv).forEach(a => {
            if (attributes.includes(a[0]) && !result) {
              result = commands[arg](result, { dateAttribut: a[0], dateVal: a[1] });
            }
          });
        } else {
          result = commands[arg](result, { dateAttribut: undefined });
        }

        if (!result) throw new Error('Флаг команды введен неверно');

        return result;
      }
      throw new Error('Команда введена неверно');
    } else {
      throw new Error('Введите только одну команду');
    }
  }
  throw new Error('Команда не введена');
}

try {
  const operation = pullOperation();
  console.log(operation);
} catch (e) {
  console.error(e);
}