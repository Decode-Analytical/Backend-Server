# RTMP-Live-Stream-Server

RTMP live stream server

# How To Use

<b>Local</b> <br />

1.  Run project:

- Clone or download repo and unzip
- Install packages

```
npm install
```

- Start

```
npm run start
```

2. Publish stream:

- Push your video stream to the url, where "stream" is just the unique name subcribers can listen on to play stream, can be changed to anything: rtmp://localhost/live/stream

3. Watch Stream:

- Use any client that can play rtmp stream and pass the url:
  <b>rtmp://localhost/live/stream</b>
- Use VLC: Open VLC -> Select Media -> Select Open Network Stream and paste stream url.

<br />

<b>Docker</b>

1. Build docker image: ensure you are in the project directory

```
docker build -t <image-name> .
```

2. Start container:

```
docker run -d -p 1935:1935 -p 8000:8000 --name <container-name> <image-name>:latest
```

3. Publishing streams

- You can create a docker network and use conatiner name in the rtmpUrl to push streams, Eg: rtmp://rtmp-container-name/live/stream

- You can Use container IP Address as well, use the command below to view IP Address and update accordingly with rtmp port, Eg: rtmp://172.17.0.3:1935/live/stream"
