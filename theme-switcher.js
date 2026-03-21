import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceColors(filePath) {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js') && !filePath.endsWith('.css')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Blue replacements
  content = content.replace(/bg-blue-600/g, 'bg-gray-900');
  content = content.replace(/bg-blue-700/g, 'bg-black');
  content = content.replace(/text-blue-600/g, 'text-gray-900');
  content = content.replace(/text-blue-700/g, 'text-black');
  content = content.replace(/border-blue-600/g, 'border-gray-900');
  content = content.replace(/border-l-blue-600/g, 'border-l-gray-900');
  content = content.replace(/ring-blue-500/g, 'ring-gray-900');
  content = content.replace(/ring-blue-600/g, 'ring-gray-900');
  content = content.replace(/bg-blue-500/g, 'bg-gray-800');
  content = content.replace(/text-blue-500/g, 'text-gray-800');
  content = content.replace(/bg-blue-100/g, 'bg-gray-100');
  content = content.replace(/text-blue-100/g, 'text-gray-100');
  content = content.replace(/bg-blue-50/g, 'bg-gray-50');
  content = content.replace(/text-blue-50/g, 'text-gray-50');
  content = content.replace(/border-blue-200/g, 'border-gray-200');

  // Yellow stars (AirBnb aesthetic uses black stars)
  content = content.replace(/text-yellow-400/g, 'text-gray-900');
  content = content.replace(/text-yellow-500/g, 'text-gray-900');
  content = content.replace(/bg-yellow-400/g, 'bg-gray-900');

  // Generic Dashboard colors
  content = content.replace(/bg-orange-500/g, 'bg-gray-700');
  content = content.replace(/bg-purple-500/g, 'bg-gray-600');
  content = content.replace(/bg-green-500/g, 'bg-gray-800');
  
  // Hardcoded gold
  content = content.replace(/bg-\[\#d2a679\]/g, 'bg-gray-900');
  content = content.replace(/hover:bg-\[\#c19568\]/g, 'hover:black');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir('./src/components', replaceColors);
walkDir('./src/pages', replaceColors);
// also hit the Navbar if it's there
walkDir('./src/router', replaceColors); 
walkDir('./src/layouts', replaceColors);

console.log('Theme swap complete!');
