const { Server } = require("socket.io");
const { initModels } = require("./models/initModels");
const models = initModels();

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected : " + socket.id);

  socket.on("connectAnalRoom", ({ analId }) => {
    console.log("connectAnal : " + analId);
    socket.join(analId);
  });
  socket.on("leaveRoom", ({ analId }) => {
    console.log("leaveRoom : " + analId);
    socket.leave(analId);
  });

  socket.on("disConnectRoomd", (analId) => {
    console.log("leaveAnal : " + analId);
    socket.leave(analId);
  });
  //Analyst 즐겨찾기추가
  socket.on("favoriteAnal", (userId, analId) => {
    //AnalDB Follow++
    const response = models.Follow.pressFollow(userId, analId);
    console.log(response);
    io.to(analId).emit("listenFavorite", response.likeNum);
  });

  socket.on("unFavoriteAnal", (userId, analId) => {
    const response = models.Follow.pressUnFollow(userId, analId);
    io.to(analId).emit("listenUnFavorite", response.likeNum);
  });

  //Report 좋아요 추가
  socket.on("LikeReport", (ReportId) => {
    io.to(ReportId).emit("listenLikeReport", likeReportNum);
  });

  socket.on("sendChat", ({ analId, chatString }) => {
    console.log("sendchat : " + chatString);
    io.to(analId).emit("listenChat", chatString);
  });

  


  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

module.exports = io;
