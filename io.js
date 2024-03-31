const {Server} = require("socket.io");
const {redis} = require("./redis/redis");

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("joinRoom", ({roomId}) => {
        socket.join(roomId);

        redis.zrange(`messages:${roomId}`, 0, -1)
            .then((messages) => {
                const data = [];
                for (const message of messages) {
                    data.push(JSON.parse(message));
                }
                socket.emit('fetchMessages', data);
            });
    });

    socket.on("leaveRoom", ({roomId}) => {
        socket.leave(roomId);
    });

    socket.on("sendMessage", ({roomId, chatMessage, user}) => {
        redis.zadd(`messages:${roomId}`, Date.now(), JSON.stringify({chatMessage, user}));
        io.to(roomId).emit("receiveMessage", {chatMessage, user});
    });

    socket.on("disconnect", (reason) => {
        console.log(reason);
    });
});

module.exports = io;
