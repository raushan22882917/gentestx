const fs = require('fs');
const { execSync } = require('child_process');

// Create a temporary directory for packaging
try {
  fs.mkdirSync('./dist', { recursive: true });
} catch (error) {
  console.error('Error creating dist directory:', error);
}

// Copy necessary files to the dist directory
const filesToCopy = [
  'package.json',
  'extension.js',
  'groqService.js',
  'testGenerator.js',
  'utils.js',
  'README.md',
  '.vscodeignore'
];

filesToCopy.forEach(file => {
  try {
    fs.copyFileSync(file, `./dist/${file}`);
    console.log(`Copied ${file} to dist directory`);
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
  }
});

// Create a simple script to install the extension
try {
  fs.writeFileSync('./install-extension.bat', `
@echo off
echo Installing GenTestX extension...
code --install-extension gentestx-0.1.0.vsix
echo Installation complete!
pause
  `, 'utf8');
  console.log('Created install-extension.bat');
} catch (error) {
  console.error('Error creating install script:', error);
}

console.log('Extension files prepared for packaging.');
console.log('To package the extension, you need to install vsce:');
console.log('npm install -g @vscode/vsce');
console.log('Then run:');
console.log('cd dist && vsce package');
console.log('This will create a .vsix file that can be installed in VSCode.');
