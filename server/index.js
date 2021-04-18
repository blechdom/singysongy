const express = require('express');
const app = express();
var http = require('http').createServer(app);

const port = process.env.PORT || 3033;

const io = require('socket.io')(http);
require('./videoChatSockets')(io);


http.listen(port, () => {
    console.log(`listening on port ${port}`);
})

