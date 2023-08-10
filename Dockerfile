FROM node:18

WORKDIR /app

# Install python
RUN apt-get update && \
  apt-get install -y python3 python3-pip python3-venv

RUN git clone --branch main https://github.com/Marco-Christiani/sensehat-node-ipc.git .
# swap w above for local testing
# COPY . /app

RUN npm ci

RUN npm run clean-build

RUN npm test

# CMD ["npm", "test"]
