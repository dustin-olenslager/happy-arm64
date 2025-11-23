#!/usr/bin/env node
// Wrapper to run happy-coder from source on Windows ARM64
// This is used when the build fails due to Rollup ARM64 issues
// 
// NOTE: This is a template. The install script will generate a version
// with the correct sourceDir path for your system.

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// This will be replaced by the install script with the actual path
const sourceDir = process.env.HAPPY_SOURCE_DIR || __dirname;
const mainFile = path.join(sourceDir, 'src', 'index.ts');

const args = process.argv.slice(2);

// On Windows, use tsx.cmd instead of tsx
const tsxCommand = os.platform() === 'win32' ? 'tsx.cmd' : 'tsx';

const child = spawn(tsxCommand, [mainFile, ...args], {
    stdio: 'inherit',
    cwd: sourceDir,
    env: { ...process.env }
});

child.on('exit', (code) => {
    process.exit(code || 0);
});

child.on('error', (err) => {
    console.error('Error spawning tsx:', err);
    process.exit(1);
});

