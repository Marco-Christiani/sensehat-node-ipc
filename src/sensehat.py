import sensehat_pb2
import zmq
from sense_hat import SenseHat

sense = SenseHat()
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:5556")

while True:
    temperature = sense.get_temperature()
    humidity = sense.get_humidity()
    pressure = sense.get_pressure()

    msg = sensehat_pb2.SensorData()
    msg.temperature = temperature
    msg.humidity = humidity
    msg.pressure = pressure

    socket.send(msg.SerializeToString())
