const fs = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fs.readdir(pathToFolder, {withFileTypes: true});

    for (const file of files) {
      const pathToFile = path.join(pathToFolder, file.name);
      const stats = await fs.stat(pathToFile);
      if (stats.isFile()) {
        console.log(`${file.name} ${(stats.size / 1024).toFixed(3)} kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
