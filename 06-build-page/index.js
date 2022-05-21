const fs = require('fs/promises');
const path = require('path');

const pathDist = path.join(__dirname, 'project-dist');
const pathSourceTemplateFile = path.join(__dirname, 'template.html');
const pathDistTemplateFile = path.join(__dirname, 'project-dist', 'index.html');
const pathSourceComponentsFiles = path.join(__dirname, 'components');
const pathSourceStylesFiles = path.join(__dirname, 'styles');
const pathToDestStyleFile = path.join(__dirname, 'project-dist', 'style.css');

const pathToSourceAssets = path.join(__dirname, 'assets');
const pathToDestAssets = path.join(__dirname, 'project-dist', 'assets');

const buildPage = async () => {
  try {
    await fs.mkdir(pathDist, {recursive: true});
    await fs.copyFile(pathSourceTemplateFile, pathDistTemplateFile);
    const fileContent = await fs.readFile(pathDistTemplateFile, 'utf-8');
    let cont = fileContent;

    const files = await fs.readdir(pathSourceComponentsFiles, {withFileTypes: true});

    for (const file of files) {
      const pathToSourceCurrentFile = path.join(pathSourceComponentsFiles, file.name);

      if (path.extname(file.name) === '.html') {
        let fl = await fs.open(pathToSourceCurrentFile);
        const flcontent = await fl.readFile('utf-8');
        cont = cont.replace(`{{${path.basename(file.name, '.html')}}}`, flcontent.toString());
      }
    }

    await fs.writeFile(pathDistTemplateFile, cont);
  } catch (error) {
    console.log(error);
  }
};

const bundleStyles = async (pathToSourceFolder) => {
  try {
    const filehandle = await fs.open(pathToDestStyleFile, 'a');
    const writeStream = await filehandle.createWriteStream(pathToDestStyleFile);
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
    const files = await fs.readdir(pathToSourceFolder, {withFileTypes: true});
    for (const file of files) {
      const pathToSourceCurrentFile = path.join(pathToSourceFolder, file.name);
      const pathToDestCurrentFile = path.join(pathToDestFolder, file.name);

      if (path.extname(file.name) === '') {
        copyDir(path.join(pathToSourceAssets, file.name), path.join(pathToDestAssets, file.name));
      } else {
        await fs.copyFile(pathToSourceCurrentFile, pathToDestCurrentFile);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

buildPage();
bundleStyles(pathSourceStylesFiles);
copyDir(pathToSourceAssets, pathToDestAssets);