const fs = require('fs');
const path = require('path');
const process = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathToFile, {flags: 'a'});

process.stdout.write('Please, write some text:\n');

process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    console.log('Good bye!');
    process.exit();
  }
  writeStream.write(data);
});

process.on('SIGINT', () => {
  console.log('Good bye!');
  process.exit();
});