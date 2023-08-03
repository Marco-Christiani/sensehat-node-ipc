const { spawn } = require('child_process');
const path = require('path');
const zmq = require('zeromq');
const protobuf = require('protobufjs');

load(join(__dirname, '../proto/sensehat.proto'), function(err, root) {
  if (err)
    throw err;

  let SensorData = root.lookupType("sensehat.SensorData");

  const pythonProcess = spawn('python3', [join(__dirname, 'sensehat.py')]);

  pythonProcess.stdout.on('data', (data) => {
    let msg = SensorData.decode(data);
    console.log(`Temperature: ${msg.temperature}, Humidity: ${msg.humidity}, Pressure: ${msg.pressure}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
});
