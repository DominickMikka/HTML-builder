const fs = require('fs/promises');
const path = require('path');

const pathToSourceFolder = path.join(__dirname, 'files');
const pathToDestFolder = path.join(__dirname, 'files-copy');



const copyDir = async (pathToSourceFolder, pathToDestFolder) => {

  const createFolder = async (pathToDestFolder) => {
    try {
      await fs.access(pathToDestFolder);
      await fs.rm(pathToDestFolder, {recursive: true});
    } catch {
      await fs.mkdir(pathToDestFolder, {recursive: true});
    }
  };

  try {
    createFolder(pathToDestFolder);
    const files = await fs.readdir(pathToSourceFolder, {withFileTypes: true},);
    for (const file of files) {
      const pathToSourceCurrentFile = path.join(pathToSourceFolder, file.name);
      const pathToDestCurrentFile = path.join(pathToDestFolder, file.name);
      await fs.copyFile(pathToSourceCurrentFile, pathToDestCurrentFile);
    }
  } catch (err) {
    console.log(err);
  }
};

copyDir(pathToSourceFolder, pathToDestFolder);