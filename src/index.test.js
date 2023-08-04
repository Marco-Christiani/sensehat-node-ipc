const path = require('path');
const protobuf = require('protobufjs');
const zmq = require('zeromq');

test('Protobuf deserialization', async () => {
  // Load the protobuf schema
  const root = await protobuf.load(path.join(__dirname, '../proto/sensehat.proto'));

  // Obtain the message type
  const SensorData = root.lookupType('SensorData');

  // Create a test message
  const testMessage = SensorData.create({
    temperature: 25.0,
    humidity: 50.0,
    pressure: 1000.0,
    magnetometerX: 12.0,
    magnetometerY: 15.0,
    magnetometerZ: 22.0,
    gyroDegX: 45.0,
    gyroDegY: 44.0,
    gyroDegZ: 32.0,
  });

  // Serialize the message
  const serializedMessage = SensorData.encode(testMessage).finish();

  // Deserialize the message
  const deserializedMessage = SensorData.decode(serializedMessage);

  // Check that the deserialized message matches the original message
  expect(deserializedMessage).toEqual(testMessage);
});


test('ZeroMQ and Protobuf communication', done => {
  const root = protobuf.loadSync(path.join(__dirname, '../proto/sensehat.proto'));

  const SensorData = root.lookupType('SensorData');

  const publisher = zmq.socket('pub');
  publisher.bindSync('tcp://127.0.0.1:5556');
  console.log('Publisher bound to port 5556');

  const subscriber = zmq.socket('sub');

  // Connect the subscriber to the publisher
  subscriber.connect('tcp://127.0.0.1:5556');
  subscriber.subscribe('data');
  console.log('Subscriber connected to port 5556');

  // Wait for the subscriber to receive a message
  subscriber.on('message', function(topic, message) {
    // Deserialize the message
    const msg = SensorData.decode(message);

    // Check the message
    expect(msg.temperature).toBeCloseTo(25.0);
    expect(msg.humidity).toBeCloseTo(50.0);
    expect(msg.pressure).toBeCloseTo(1000.0);
    expect(msg.magnetometerX).toBeCloseTo(12.0);
    expect(msg.magnetometerY).toBeCloseTo(15.0);
    expect(msg.magnetometerZ).toBeCloseTo(22.0);
    expect(msg.gyroDegX).toBeCloseTo(45.0);
    expect(msg.gyroDegY).toBeCloseTo(44.0);
    expect(msg.gyroDegZ).toBeCloseTo(32.0);

    // Close the sockets
    subscriber.close();
    publisher.close();

    // End the test
    done();
  });

  // Give the subscriber a moment to connect before the publisher starts sending
  setTimeout(() => {
    // Create a test message
    const testMessage = SensorData.create({
      temperature: 25.0,
      humidity: 50.0,
      pressure: 1000.0,
      magnetometerX: 12.0,
      magnetometerY: 15.0,
      magnetometerZ: 22.0,
      gyroDegX: 45.0,
      gyroDegY: 44.0,
      gyroDegZ: 32.0,
    });

    // Serialize the message
    const serializedMessage = SensorData.encode(testMessage).finish();

    // Publish the message
    publisher.send(['data', serializedMessage]);
  }, 500);
});
