import { ChildProcess, spawn } from "child_process";
import { join } from "path";
import { Socket, socket } from "zeromq";
import { existsSync } from "fs";
import EventEmitter from "events";
import { SensorData } from "../proto/sensehat_pb";

class SensorDataEmitter extends EventEmitter {
  private sock: Socket;
  private pythonProcess: ChildProcess | undefined;

  constructor() {
    super();
    this.sock = socket("sub");
    this.sock.connect("tcp://127.0.0.1:5556");
    this.sock.subscribe("");
  }

  public start(): void {
    this.sock.on("message", (data: any) => {
      const uint8Message = new Uint8Array(data.buffer);
      const msg: SensorData = SensorData.deserializeBinary(uint8Message);
      const msgObj: SensorData.AsObject = msg.toObject();
      this.emit("data", msgObj);
    });

    const pybin: string = join(__dirname, "../venv/bin/python");
    const scriptpath: string = join(__dirname, "../src/sensehat.py");

    if (!existsSync(pybin)) {
      console.error(`Python binary not found at path: ${pybin}`);
      return;
    } else if (!existsSync(scriptpath)) {
      console.error(`Python script not found at path: ${scriptpath}`);
      return;
    }
    this.pythonProcess = spawn(pybin, [scriptpath]);
  }
  
  public stop(): void {
    // kill running python process
    if (this.pythonProcess) {
      this.pythonProcess.kill();
      // between now and when (if) we start up again we shouldnt
      // keep a ref to a non-existent process
      this.pythonProcess = undefined;
    }

    // close ZeroMQ socket
    this.sock.close();
  }
}

export {
  SensorDataEmitter
}
