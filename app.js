const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// const indexRouter = require('./routes/index');
const usersRouter = require("./routes/users");
const reportsRouter = require("./routes/reports");
const analystRouter = require("./routes/analyst");
const analystsRouter = require("./routes/analysts");
const firmsRouter = require("./routes/firms");
const followAnalRouter = require("./routes/followAnal");
const likeReportRouter = require("./routes/likeReport");
const hateReportRouter = require("./routes/hateReport");
const likeFirmRouter = require("./routes/likeFirm");
const hateFirmRouter = require("./routes/hateFirm");
const bookmarkRouter = require("./routes/bookmark");
const todayRecommendRouter = require("./routes/todayRecommend");
const reportSectorRouter = require("./routes/reportSector");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/reports", reportsRouter);
app.use("/analyst", analystRouter);
app.use("/firms", firmsRouter);
app.use("/followAnal", followAnalRouter);
app.use("/likeReport", likeReportRouter);
app.use("/hateReport", hateReportRouter);
app.use("/bookmark", bookmarkRouter);
app.use("/analysts", analystsRouter);
app.use("/reportSector", reportSectorRouter);
app.use("/likeFirm", likeFirmRouter);
app.use("/hateFirm", hateFirmRouter);
app.use("/todayRecommend", todayRecommendRouter);

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

// // 매일 10시에 리포트 업데이트
// const rule = new schedule.RecurrenceRule();
// rule.hour = 10;
// rule.minute = 0;

// const job = schedule.scheduleJob(rule, function () {
//   notifyUsersOfNewReports();
// });

module.exports = app;
