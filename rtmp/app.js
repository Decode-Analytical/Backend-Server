const NodeMediaServer = require("node-media-server");

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: process.env.PORT || 8000,
    allow_origin: "*",
  },
};

const nms = new NodeMediaServer(config);

nms.on("doneConnect", (id, args) => {
  console.log("[Diconnected]: ", `id=${id}`);
});

nms.on("postPublish", (id, StreamPath, args) => {
  console.log("[Creator]", `id=${id} StreamPath=${StreamPath}`);
});

nms.on("prePlay", (id, StreamPath, args) => {
  console.log("[Subscribers]: ", `id=${id} StreamPath=${StreamPath}`);
});

nms.run();
