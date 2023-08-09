import proto.sensehat_pb2 as sensehat_pb2
import zmq
from sense_hat import SenseHat
import time


sense = SenseHat()
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5556")
while True:
    time.sleep(1)
    msg = sensehat_pb2.SensorData()
    msg.temperature = sense.get_temperature()
    msg.humidity = sense.get_humidity()
    msg.pressure = sense.get_pressure()

    mag_deg = sense.get_compass_raw()
    msg.magnetometerX = mag_deg['x']
    msg.magnetometerY = mag_deg['y']
    msg.magnetometerZ = mag_deg['z']

    accel_deg = sense.get_accelerometer()
    msg.accelDegRoll = accel_deg['roll']
    msg.accelDegPitch = accel_deg['pitch']
    msg.accelDegYaw = accel_deg['yaw']

    gyro_deg = sense.get_gyroscope()
    msg.gyroDegRoll = gyro_deg['roll']
    msg.gyroDegPitch = gyro_deg['pitch']
    msg.gyroDegYaw = gyro_deg['yaw']

    socket.send(msg.SerializeToString())
