const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./routes/users");
const reportsRouter = require("./routes/reports");
const analystsRouter = require("./routes/analysts");
const firmsRouter = require("./routes/firms");
const followRouter = require("./routes/follows");
const likeReportRouter = require("./routes/like-reports");
const hateReportRouter = require("./routes/dislike-reports");
const likeFirmRouter = require("./routes/like-firms");
const hateFirmRouter = require("./routes/dislike-firms");
const bookmarksRouter = require("./routes/bookmarks");
const todayRouter = require("./routes/today");
const reportSectorRouter = require("./routes/reportSectors");
const app = express();
const cors = require("cors");
const {
    setSchedule,
    updateReports,
    updateAnalysts,
    updateFirms,
    notifyUsersOfNewReports, updateTodayAnalysts,
} = require("./services/schedule");
app.use(cors({origin: "*"}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/reports", reportsRouter);
app.use("/firms", firmsRouter);
app.use("/follows", followRouter);
app.use("/like-reports", likeReportRouter);
app.use("/dislike-reports", hateReportRouter);
app.use("/bookmarks", bookmarksRouter);
app.use("/analysts", analystsRouter);
app.use("/reportSector", reportSectorRouter);
app.use("/like-firms", likeFirmRouter);
app.use("/dislike-firms", hateFirmRouter);
app.use("/today", todayRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// 매일 오전 10시 15분에 리포트, 애널리스트, 증권사 업데이트, 새 리포트 알림
setSchedule(
    {hour: 10, minute: 15},
    updateReports,
    updateAnalysts,
    updateFirms,
    notifyUsersOfNewReports,
    updateTodayAnalysts
);

module.exports = app;
