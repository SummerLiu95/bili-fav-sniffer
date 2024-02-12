const { spawn } = require('child_process');

// Start the service process
const server = spawn('node', ['/app/server.js']);

server.stdout.on('data', (data) => {
  console.log(`server script output: ${data}`);
});

// Start the trigger process
const trigger = spawn('node', ['/app/trigger.js']);

trigger.stdout.on('data', (data) => {
  console.log(`trigger script output: ${data}`);
});

server.on('close', (code) => {
  console.log(`server script exited with code ${code}`);
});

trigger.on('close', (code) => {
  console.log(`trigger script exited with code ${code}`);
});
