import sensehat_pb2
import zmq
from sense_hat import SenseHat
import time


def main():
    sense = SenseHat()
    context = zmq.Context()
    socket = context.socket(zmq.PUB)
    socket.bind("tcp://*:5556")
    while True:
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

        print('Sending:', msg)
        socket.send(msg.SerializeToString())
        time.sleep(1)


def test():
    print('in test')
    p = sensehat_pb2.SensorData()
    ctx = zmq.Context()
    sub = ctx.socket(zmq.SUB)
    sub.connect('tcp://127.0.0.1:5556')
    sub.setsockopt_string(zmq.SUBSCRIBE, '')
    print('subbed')

    while True:
        data = sub.recv()
        p.ParseFromString(data)
        print('got data', p)


if __name__ == "__main__":
    import multiprocessing
    # Create two separate processes for each function
    process1 = multiprocessing.Process(target=main)
    process2 = multiprocessing.Process(target=test)

    # Start the processes
    process1.start()
    process2.start()

    # Wait for both processes to finish (this won't happen as the functions run indefinitely)
    process1.join()
    process2.join()
