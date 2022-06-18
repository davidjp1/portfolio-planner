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

copyRecursiveSync('./public', './build');

require('esbuild').build({
  bundle: true,
  define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') },
  entryPoints: ['./src/index.tsx'],
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  outfile: 'build/bundle.js',
  loader: {'.js': 'jsx'},
  target: ["chrome58", "edge18", "safari11", "firefox57"]
}).catch(() => process.exit(1));