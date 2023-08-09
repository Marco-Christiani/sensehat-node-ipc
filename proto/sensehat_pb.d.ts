// package: 
// file: sensehat.proto

import * as jspb from "google-protobuf";

export class SensorData extends jspb.Message {
  getTemperature(): number;
  setTemperature(value: number): void;

  getHumidity(): number;
  setHumidity(value: number): void;

  getPressure(): number;
  setPressure(value: number): void;

  getMagnetometerx(): number;
  setMagnetometerx(value: number): void;

  getMagnetometery(): number;
  setMagnetometery(value: number): void;

  getMagnetometerz(): number;
  setMagnetometerz(value: number): void;

  getAcceldegroll(): number;
  setAcceldegroll(value: number): void;

  getAcceldegpitch(): number;
  setAcceldegpitch(value: number): void;

  getAcceldegyaw(): number;
  setAcceldegyaw(value: number): void;

  getGyrodegroll(): number;
  setGyrodegroll(value: number): void;

  getGyrodegpitch(): number;
  setGyrodegpitch(value: number): void;

  getGyrodegyaw(): number;
  setGyrodegyaw(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SensorData.AsObject;
  static toObject(includeInstance: boolean, msg: SensorData): SensorData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SensorData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SensorData;
  static deserializeBinaryFromReader(message: SensorData, reader: jspb.BinaryReader): SensorData;
}

export namespace SensorData {
  export type AsObject = {
    temperature: number,
    humidity: number,
    pressure: number,
    magnetometerx: number,
    magnetometery: number,
    magnetometerz: number,
    acceldegroll: number,
    acceldegpitch: number,
    acceldegyaw: number,
    gyrodegroll: number,
    gyrodegpitch: number,
    gyrodegyaw: number,
  }
}

