#!/usr/bin/python
import sensehat_pb2
import zmq
from sense_hat import SenseHat

sense = SenseHat()
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5556")


def main():
    while True:
        msg = sensehat_pb2.SensorData()
        msg.temperature = sense.get_temperature()
        msg.humidity = sense.get_humidity()
        msg.pressure = sense.get_pressure()

        magDegX, magDegY, magDegZ = sense.get_compass_raw()
        msg.magnetometerX = magDegX
        msg.magnetometerY = magDegY
        msg.magnetometerZ = magDegZ

        gyroDegX, gyroDegY, gyroDegZ = sense.get_accelerometer()
        msg.gyroDegX = gyroDegX
        msg.gyroDegY = gyroDegY
        msg.gyroDegZ = gyroDegZ

        socket.send(['data', msg.SerializeToString()])


if __name__ == "__main__":
    main()
