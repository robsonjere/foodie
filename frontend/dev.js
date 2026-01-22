#!/usr/bin/env node

const { spawn } = require('child_process');
const open = require('open');
const fs = require('fs');

const PORT = 3000;
const URL = `http://localhost:${PORT}`;
let browserOpened = false;

const child = spawn('next', ['dev', '-p', PORT.toString()], {
  stdio: 'inherit',
  shell: true,
});

// Wait a moment for the server to start, then open browser
setTimeout(async () => {
  if (!browserOpened) {
    browserOpened = true;
    try {
      await open(URL);
      console.log(`\n✅ Browser opened at ${URL}\n`);
    } catch (err) {
      console.log(`\n⚠️ Could not open browser. Visit ${URL} manually\n`);
    }
  }
}, 2000);

process.on('exit', () => {
  child.kill();
});

child.on('exit', () => {
  process.exit();
});
