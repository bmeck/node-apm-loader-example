import {readFile} from 'fs';
readFile('./package.json', 'utf8', (...args) => {
  console.dir(args, {
    colors: true
  });
});
