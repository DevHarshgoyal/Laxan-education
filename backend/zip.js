/**
 * backend/zip.js
 * Packages the backend directory into ../backend.zip for Hostinger upload.
 *
 * Usage:
 *   npm run zip
 *   node zip.js [--include-env] [--include-node-modules]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const args = new Set(process.argv.slice(2));
const includeEnv = args.has('--include-env');
const includeNodeModules = args.has('--include-node-modules');

const backendDir = __dirname;
const outputZip = path.resolve(backendDir, '..', 'backend.zip');

function shouldExclude(relPosixPath, isDirectory) {
  const parts = relPosixPath.split('/');
  const baseName = parts[parts.length - 1];

  if (baseName === '.git' || baseName === '.DS_Store' || baseName === 'Thumbs.db') {
    return true;
  }
  if (!includeNodeModules && parts.includes('node_modules')) {
    return true;
  }
  if (parts.includes('logs') || (!isDirectory && baseName.endsWith('.log'))) {
    return true;
  }
  if (!isDirectory && baseName.endsWith('.zip')) {
    return true;
  }
  if (!includeEnv && !isDirectory && (baseName === '.env' || (baseName.startsWith('.env.') && baseName !== '.env.example'))) {
    return true;
  }
  return false;
}

function collectFiles(dir, relBase = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPosix = relBase ? `${relBase}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);
    const isDir = entry.isDirectory();

    if (shouldExclude(relPosix, isDir)) {
      continue;
    }

    if (isDir) {
      files.push(...collectFiles(fullPath, relPosix));
    } else if (entry.isFile()) {
      files.push({ fullPath, entryName: `backend/${relPosix}` });
    }
  }
  return files;
}

function createZipWindows(files, destZip) {
  const manifestPath = path.join(backendDir, '.zip-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(files), 'utf8');

  const psScript = `
    $ErrorActionPreference = 'Stop'
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $dest = '${destZip.replace(/'/g, "''")}'
    $manifest = Get-Content -Raw -Encoding UTF8 '${manifestPath.replace(/'/g, "''")}' | ConvertFrom-Json
    if (Test-Path $dest) { Remove-Item -Force $dest }
    $zip = [System.IO.Compression.ZipFile]::Open($dest, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
      foreach ($item in $manifest) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
          $zip,
          $item.fullPath,
          $item.entryName,
          [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
      }
    } finally {
      $zip.Dispose()
    }
  `;

  try {
    execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript], {
      stdio: 'inherit'
    });
  } finally {
    if (fs.existsSync(manifestPath)) {
      fs.unlinkSync(manifestPath);
    }
  }
}

function createZipPosix(destZip) {
  if (fs.existsSync(destZip)) {
    fs.unlinkSync(destZip);
  }
  const excludes = ['.git/*', '*.log', 'logs/*', '*.zip'];
  if (!includeNodeModules) excludes.push('node_modules/*');
  if (!includeEnv) excludes.push('.env', '.env.local', '.env.production');

  const zipArgs = ['-r', destZip, 'backend', ...excludes.flatMap(ex => ['-x', `backend/${ex}`])];
  execFileSync('zip', zipArgs, { cwd: path.resolve(backendDir, '..'), stdio: 'inherit' });
}

function run() {
  const files = collectFiles(backendDir);
  if (files.length === 0) {
    console.error('No files found to package.');
    process.exit(1);
  }

  console.log(`Packaging ${files.length} files into ${outputZip}...`);
  if (process.platform === 'win32') {
    createZipWindows(files, outputZip);
  } else {
    createZipPosix(outputZip);
  }

  const stats = fs.statSync(outputZip);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`✓ Created ${outputZip} (${files.length} files, ${sizeKb} KB)`);
}

run();
