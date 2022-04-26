const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  let entries = await fsp.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fsp.copyFile(srcPath, destPath);
  }
}

async function copyLibs() {
  if (!fs.existsSync('public/charting_library'))
    await copyDir(
      'node_modules/@sovryn/charting-library/public/charting_library',
      'public/charting_library',
    );
  if (!fs.existsSync('public/datafeeds'))
    await copyDir(
      'node_modules/@sovryn/charting-library/public/datafeeds',
      'public/datafeeds',
    );
}

module.exports = copyLibs;
