/* eslint-disable */
const fs = require('fs');
const path = require('path');

require('dotenv').config();

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

const build = async (hotswap) => {
  const define = { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development") };

  for (const k in process.env) {
    console.log(k);
    define[`process.env.${k}`] = JSON.stringify(process.env[k])
  }
  
  

  if(fs.existsSync('./build')) fs.rmSync('./build', {recursive: true, force: true});
  fs.mkdirSync('./build');
  copyRecursiveSync('./public', './build');

  return require('esbuild').build({
    incremental: hotswap,
    inject: ['./react-inject.js'],
    bundle: true,
    define,
    entryPoints: ['./src/index.tsx'],
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    outfile: './build/static/bundle.js',
    loader: {'.js': 'jsx'},
    target: ["chrome58", "edge18", "safari11", "firefox57"]
  }).catch(() => process.exit(1));
};

build(false);

module.exports = {build};