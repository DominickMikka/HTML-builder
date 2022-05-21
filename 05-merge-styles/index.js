const fs = require('fs/promises');
const path = require('path');

const pathToSourceFolder = path.join(__dirname, 'styles');
const pathToDestFile = path.join(__dirname, 'project-dist', 'bundle.css');

const bundleStyles = async (pathToSourceFolder) => {
  try {
    const filehandle = await fs.open(pathToDestFile, 'a');
    const writeStream = await filehandle.createWriteStream(pathToDestFile);
    const files = await fs.readdir(pathToSourceFolder, {withFileTypes: true});

    for (const file of files) {
      const pathToSourceCurrentFile = path.join(pathToSourceFolder, file.name);
      if (path.extname(file.name) === '.css') {
        let fl = await fs.open(pathToSourceCurrentFile);
        const readStream = await fl.createReadStream(pathToSourceCurrentFile, 'utf-8');
        await readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

bundleStyles(pathToSourceFolder);