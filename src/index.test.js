const protobuf = require('protobufjs');
const path = require('path');

test('Protobuf deserialization', async () => {
  // Load the protobuf schema
  const root = await protobuf.load(path.join(__dirname, '../proto/sensehat.proto'));

  // Obtain the message type
  const SensorData = root.lookupType('SensorData');

  // Create a test message
  const testMessage = SensorData.create({ temperature: 25.0, humidity: 50.0, pressure: 1000.0 });

  // Serialize the message
  const serializedMessage = SensorData.encode(testMessage).finish();

  // Deserialize the message
  const deserializedMessage = SensorData.decode(serializedMessage);

  // Check that the deserialized message matches the original message
  expect(deserializedMessage).toEqual(testMessage);
});
