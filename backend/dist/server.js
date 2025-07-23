"use strict";

require("module-alias/register");
var _express = _interopRequireDefault(require("express"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _http = require("http");
var _sockets = require("./sockets");
var _auth = _interopRequireDefault(require("./router/auth.routes"));
var _dashboard = _interopRequireDefault(require("./router/dashboard"));
var _teams = _interopRequireDefault(require("./router/teams.routes"));
var _document = _interopRequireDefault(require("./router/document.routes"));
var _tasks = _interopRequireDefault(require("./router/tasks.routes"));
var _notification = _interopRequireDefault(require("./router/notification.routes"));
var _project = _interopRequireDefault(require("./router/project.routes"));
var _liveblocks = _interopRequireDefault(require("./router/liveblocks.route"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Load environment variables first
_dotenv["default"].config();
var app = (0, _express["default"])();

// Create HTTP server
var server = (0, _http.createServer)(app);

// Initialize Socket.io BEFORE importing routes

(0, _sockets.initSocketServer)(server);

// MOVE ALL ROUTE IMPORTS HERE (after Socket.io init)

app.use(_express["default"].json());
app.use((0, _cookieParser["default"])());
var furl = process.env.FRONTEND_URL;
app.use((0, _cors["default"])({
  origin: [furl, "http://localhost:3000", "https://collabify-site.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
}));
app.use("/auth", _auth["default"]);
app.use("/dashboard", _dashboard["default"]);
app.use("/teams", _teams["default"]);
app.use("/documents", _document["default"]);
app.use("/tasks", _tasks["default"]);
app.use("/notifications", _notification["default"]);
app.use("/projects", _project["default"]);
app.use("/liveblocks", _liveblocks["default"]);
app.get("/", function (req, res) {
  res.json({
    message: "This is the Collabify Backend Application and you're at the Unauthorised route of the Collabify (i.e - `/`)",
    success: true
  });
  return;
});
var PORT = Number(process.env.PORT) || 5000;

// FIXED: Added '0.0.0.0' host binding for Render
server.listen(PORT, "0.0.0.0", function () {
  console.log("Listening On The Port ".concat(PORT));
});
//# sourceMappingURL=server.js.map