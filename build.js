/* eslint-disable */
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const buildHash = '.' + uuidv4();

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

const makeHtml = () => {
  ejs.renderFile('./public/index.ejs', { buildHash }, function (err, str) {
    if (err) console.error(err);
    fs.writeFileSync('./build/index.html', str);
  });
};

const build = async (hotswap) => {
  const define = {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
  };

  for (const k in process.env) {
    if (k.startsWith('REACT_APP_')) {
      define[`process.env.${k}`] = JSON.stringify(process.env[k]);
    }
  }

  if (fs.existsSync('./build'))
    fs.rmSync('./build', { recursive: true, force: true });
  fs.mkdirSync('./build');
  copyRecursiveSync('./public', './build');

  return require('esbuild')
    .build({
      incremental: hotswap,
      inject: ['./react-inject.js'],
      bundle: true,
      define,
      entryPoints: ['./src/index.tsx'],
      sourcemap: true,
      minify: process.env.NODE_ENV === 'production',
      outfile: `./build/static/bundle${buildHash}.js`,
      loader: { '.js': 'jsx' },
      target: ['chrome58', 'edge18', 'safari11', 'firefox57'],
    })
    .then((builder) => {
      makeHtml();
      return builder;
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
};

build(false);

module.exports = { build };
