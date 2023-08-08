const { spawn } = require('child_process');
const path = require('path');
const zmq = require('zeromq');
const protobuf = require('protobufjs');
const fs = require('fs');
const EventEmitter = require('events');

class SensorDataEmitter extends EventEmitter {
  constructor() {
    super();
    this.sock = zmq.socket('sub');
    this.sock.connect('tcp://127.0.0.1:5556');
    this.sock.subscribe('data');
  }

  start() {
    protobuf.load(path.join(__dirname, 'sensehat.proto')).then(root => {
      const SensorData = root.lookupType("SensorData");

      this.sock.on('message', (_topic, data) => {
        const msg = SensorData.decode(data);
        this.emit('data', msg);
      });

      const pybin = path.join(__dirname, '../venv/bin/python');
      const scriptpath = path.join(__dirname, 'sensehat.py');

      if (!fs.existsSync(pybin)) {
        console.error(`Python binary not found at path: ${pybin}`);
        return;
      } else if (!fs.existsSync(scriptpath)) {
        console.error(`Python script not found at path: ${scriptpath}`);
        return;
      }
      spawn(pybin, [scriptpath]);
    }).catch(err => {
      console.error(err);
    });
  }
}


module.exports = {
  SensorDataEmitter
}
