# sensehat-node-ipc
A Node.js package to read sensor data from the Raspberry Pi Sense HAT through IPC.

## Installation on Raspberry Pi

> Assuming you have python and pip installed.

System dependencies

```
sudo apt install sense-hat python3-rtimulib libatlas-base-dev
```

Install

```
npm install
```

## Notes

Need protobuf version 3.20.* not newer or its unhappy (ubuntu proto compiler out of date?).
The python `sense-hat` package depends on [RTIMULib](https://github.com/RPi-Distro/RTIMULib) so we need `--system-site-packages` when we run pip so the venv can see it.
`libatlas-base-dev` for a numpy dependency iirc. ymmv.
