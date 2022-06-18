/* eslint-disable */
const { build } = require('./build');
const chokidar = require('chokidar');
const servor = require('servor');

const fs = require('fs');
const path = require('path');

const copyRecursiveSync = function(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

(async () => {
  copyRecursiveSync('./public', './build');
  fs.copyFileSync
  const builder = await build(true);
  chokidar
    .watch('./src/**/*.{js,jsx,ts,tsx,html}', {
      interval: 0,
    })
    .on('all', () => {
      builder.rebuild();
    });
    await servor({
      root: './build',
      fallback: 'index.html',
      reload: true,
      port: 8080,
    });
    console.log('dev server started with hotload enabled!');
})();
