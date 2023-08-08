const { spawn } = require("child_process");
const path = require("path");
const zmq = require("zeromq");
const fs = require("fs");
const EventEmitter = require("events");
const messages = require("./sensehat_pb");

class SensorDataEmitter extends EventEmitter {
  constructor() {
    super();
    this.sock = zmq.socket("sub");
    this.sock.connect("tcp://127.0.0.1:5556");
    this.sock.subscribe("data");
  }

  start() {
    this.sock.on("message", (data) => {
      const msg = messages.SensorData.deserializeBinary(data);
      this.emit("data", msg.toObject());
    });

    const pybin = path.join(__dirname, "../venv/bin/python");
    const scriptpath = path.join(__dirname, "sensehat.py");

    if (!fs.existsSync(pybin)) {
      console.error(`Python binary not found at path: ${pybin}`);
      return;
    } else if (!fs.existsSync(scriptpath)) {
      console.error(`Python script not found at path: ${scriptpath}`);
      return;
    }
    spawn(pybin, [scriptpath]);
  }
}


module.exports = {
  SensorDataEmitter
}
