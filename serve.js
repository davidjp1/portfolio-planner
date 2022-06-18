// source: https://github.com/zaydek/esbuild-hot-reload/blob/master/serve.js
// eslint-disable-line
const { build } = require('esbuild');
// eslint-disable-line
const chokidar = require('chokidar');
// eslint-disable-line
const liveServer = require('live-server');
const fs = require('fs');
const path = require('path');

// const copyRecursiveSync = function(src, dest) {
//   const exists = fs.existsSync(src);
//   const stats = exists && fs.statSync(src);
//   const isDirectory = exists && stats.isDirectory();
//   if (isDirectory) {
//     fs.readdirSync(src).forEach(function(childItemName) {
//       copyRecursiveSync(path.join(src, childItemName),
//                         path.join(dest, childItemName));
//     });
//   } else {
//     fs.copyFileSync(src, dest);
//   }
// };

(async () => {
  // copyRecursiveSync('./public', './build');
  fs.copyFileSync
  const builder = await build({
    bundle: true,
    define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') },
    entryPoints: ['./src/index.tsx'],
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    outfile: 'build/bundle.js',
    incremental: true,
    target: ["chrome58", "edge18", "safari11", "firefox57"]
  });
  chokidar
    .watch('./src/**/*.{js,jsx,ts,tsx,html}', {
      interval: 10,
    })
    .on('all', () => {
      builder.rebuild();
    });
  liveServer.start({
    open: true,
    port: +process.env.PORT || 8080,
    root: 'build',
  });
})();
