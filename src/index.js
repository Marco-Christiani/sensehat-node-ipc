const { spawn } = require('child_process');
const path = require('path');
const zmq = require('zeromq');
const protobuf = require('protobufjs');
const fs = require('fs');

protobuf.load(path.join(__dirname, '../proto/sensehat.proto'), function(err, root) {
  if (err)
    throw err;

  let SensorData = root.lookupType("SensorData");


  const pybin = path.join(__dirname, '../venv/bin/python');
  const scriptpath = path.join(__dirname, 'sensehat.py');

  if (!fs.existsSync(pybin)) {
    console.error(`Python binary not found at path: ${pybin}`);
  } else if (!fs.existsSync(scriptpath)) {
    console.error(`Python script not found at path: ${scriptpath}`);
  } else {
    console.log('spawning!')
    const pythonProcess = spawn(pybin, [scriptpath]);
  }
  console.log('spawned')
  const sock = zmq.socket('sub');
  sock.connect('tcp://127.0.0.1:5556');
  sock.subscribe('data');

  sock.on('message', (topic, data) => {
    let msg = SensorData.decode(data);
    console.log(`Temperature: ${msg.temperature}, Humidity: ${msg.humidity}, Pressure: ${msg.pressure}`);
  });
});
