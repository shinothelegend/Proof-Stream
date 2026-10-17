import fs from 'fs';
import path from 'path';

// Defined color tokens in globals.css / tailwind.config.ts
const DEFINED_CSS_VARS = new Set([
  '--color-bg',
  '--color-panel',
  '--color-hairline',
  '--color-ink',
  '--color-dim',
  '--color-accent',
  '--color-accent-fg',
  '--color-success',
  '--color-alert',
  '--color-pix-bg',
  '--color-pix-panel',
  '--color-pix-border',
  '--color-pix-border-subtle',
  '--color-pix-hairline',
  '--color-pix-ink',
  '--color-pix-dim',
  '--color-pix-accent',
  '--color-pix-accent-fg',
  '--color-pix-gold',
  '--color-pix-cyan',
  '--color-pix-success',
  '--color-pix-mint',
  '--color-pix-alert',
]);

const DEFINED_PIX_KEYS = new Set([
  'bg',
  'panel',
  'hairline',
  'ink',
  'dim',
  'accent',
  'accent-fg',
  'success',
  'alert',
  'gold',
  'cyan',
  'mint',
]);

function getAllFiles(dir, exts = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.next') {
        files = files.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcFiles = getAllFiles(path.resolve('src'));
let errors = [];

const varColorRegex = /var\((--color-[a-zA-Z0-9-]+)\)/g;
// Match text-pix-*, bg-pix-*, border-pix-*, or pix-*
const pixClassRegex = /\b(?:text|bg|border|ring|fill|stroke|from|to|via)-pix-([a-zA-Z0-9-]+)\b/g;

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(process.cwd(), file);

  // Check var(--color-*)
  let match;
  while ((match = varColorRegex.exec(content)) !== null) {
    const varName = match[1];
    if (!DEFINED_CSS_VARS.has(varName)) {
      errors.push(`${relPath}: Undefined CSS variable "${varName}"`);
    }
  }

  // Check pix-* classes
  while ((match = pixClassRegex.exec(content)) !== null) {
    const pixToken = match[1];
    if (!DEFINED_PIX_KEYS.has(pixToken)) {
      errors.push(`${relPath}: Undefined Tailwind pix token "${pixToken}" in class match "${match[0]}"`);
    }
  }
}

console.log(`[verify-tokens] Checked ${srcFiles.length} files in src/`);
if (errors.length > 0) {
  console.error(`[verify-tokens] Found ${errors.length} missing design tokens:\n` + errors.slice(0, 50).join('\n'));
  if (errors.length > 50) console.error(`...and ${errors.length - 50} more.`);
  process.exit(1);
} else {
  console.log('[verify-tokens] ALL design tokens and CSS variables are verified and valid! ✓');
  process.exit(0);
}
