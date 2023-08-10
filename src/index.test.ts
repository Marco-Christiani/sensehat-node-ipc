import { socket } from "zeromq";
import { SensorData } from "../proto/sensehat_pb";
import { SensorDataEmitter } from "./index";

test("Protobuf deserialization @unittest", () => {
  // Create a test message
  const testMessage = new SensorData();
  testMessage.setTemperature(25.0);
  testMessage.setHumidity(50.0);
  testMessage.setPressure(1000.0);

  testMessage.setMagnetometerx(12.0);
  testMessage.setMagnetometery(15.0);
  testMessage.setMagnetometerz(22.0);

  testMessage.setAcceldegroll(45.0);
  testMessage.setAcceldegpitch(44.0);
  testMessage.setAcceldegyaw(32.0);

  testMessage.setGyrodegroll(45.0);
  testMessage.setGyrodegpitch(44.0);
  testMessage.setGyrodegyaw(32.0);

  const serializedMessage = testMessage.serializeBinary();

  const deserializedMessage = SensorData.deserializeBinary(serializedMessage);

  expect(deserializedMessage.toObject()).toEqual(testMessage.toObject());
});

test("ZeroMQ and Protobuf communication @unittest", (done) => {
  const publisher = socket("pub");
  publisher.bindSync("tcp://127.0.0.1:5556");
  console.log("Publisher bound to port 5556");

  const subscriber = socket("sub");

  subscriber.connect("tcp://127.0.0.1:5556");
  subscriber.subscribe("data");
  console.log("Subscriber connected to port 5556");

  // Wait for the subscriber to receive a message
  subscriber.on("message", function(_topic, message) {
    // Convert the Buffer to a Uint8Array and then deserialize
    const uint8Message = new Uint8Array(message.buffer);

    const msg = SensorData.deserializeBinary(uint8Message);

    // Check the message
    expect(msg.getTemperature()).toBeCloseTo(25.1);
    expect(msg.getHumidity()).toBeCloseTo(51.1);
    expect(msg.getPressure()).toBeCloseTo(1100.1);
    expect(msg.getMagnetometerx()).toBeCloseTo(12.1);
    expect(msg.getMagnetometery()).toBeCloseTo(15.1);
    expect(msg.getMagnetometerz()).toBeCloseTo(22.1);
    expect(msg.getGyrodegroll()).toBeCloseTo(45.1);
    expect(msg.getGyrodegpitch()).toBeCloseTo(44.1);
    expect(msg.getGyrodegyaw()).toBeCloseTo(32.1);

    subscriber.close();
    publisher.close();

    done();
  });

  setTimeout(() => {
    // Create a test message
    const testMessage = new SensorData();
    testMessage.setTemperature(25.1);
    testMessage.setHumidity(51.1);
    testMessage.setPressure(1100.1);

    testMessage.setMagnetometerx(12.1);
    testMessage.setMagnetometery(15.1);
    testMessage.setMagnetometerz(22.1);

    testMessage.setAcceldegroll(45.1);
    testMessage.setAcceldegpitch(44.1);
    testMessage.setAcceldegyaw(32.1);

    testMessage.setGyrodegroll(45.1);
    testMessage.setGyrodegpitch(44.1);
    testMessage.setGyrodegyaw(32.1);

    const serializedMessage = testMessage.serializeBinary();

    const bufferMessage = Buffer.from(serializedMessage);

    publisher.send(['data', bufferMessage]);
  }, 800);
}, 5000);

test("Live RPi test @integration", (done) => {
  // filter out this test if not running on rpi!
  const sensorDataEmitter = new SensorDataEmitter();

  sensorDataEmitter.on("data", (msg: SensorData.AsObject) => {
    console.log(
      `Temperature: ${msg.temperature}, Humidity: ${msg.humidity}, Pressure: ${msg.pressure}`,
    );
    done();
  });

  sensorDataEmitter.start();
  console.log("started");
});
