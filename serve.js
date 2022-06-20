/* eslint-disable */
const { build } = require('./build');
const chokidar = require('chokidar');
const { startDevServer } = require('@web/dev-server');
const { esbuildPlugin } = require('@web/dev-server-esbuild');
const fs = require('fs');
const path = require('path');

const copyRecursiveSync = function (src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

(async () => {
  copyRecursiveSync('./public', './build');

  const builder = await build(true);
  chokidar
    .watch('./src/**/*.{js,jsx,ts,tsx,html}', {
      ignoreInitial: true,
      interval: 100,
    })
    .on('all', () => {
      builder.rebuild();
    });
  const port = +process.env.PORT || 8080;
  await startDevServer({
    config: {
      appIndex: './build/index.html',
      rootDir: './build',
      plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
      watch: true,
      clearTerminalOnReload: true,
      open: true,
      port,
    },
  });
})();
