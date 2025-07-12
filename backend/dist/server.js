"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http"); // ADD THIS
// Load environment variables first
dotenv_1.default.config(); // MOVE THIS TO TOP
const app = (0, express_1.default)();
// Create HTTP server
const server = (0, http_1.createServer)(app); // ADD THIS
// Initialize Socket.io BEFORE importing routes
const sockets_1 = require("./sockets");
(0, sockets_1.initSocketServer)(server); // CALL THIS
// MOVE ALL ROUTE IMPORTS HERE (after Socket.io init)
const auth_routes_1 = __importDefault(require("./router/auth.routes"));
const dashboard_1 = __importDefault(require("./router/dashboard"));
const teams_routes_1 = __importDefault(require("./router/teams.routes"));
const document_routes_1 = __importDefault(require("./router/document.routes"));
const tasks_routes_1 = __importDefault(require("./router/tasks.routes"));
const notification_routes_1 = __importDefault(require("./router/notification.routes"));
const project_routes_1 = __importDefault(require("./router/project.routes"));
const liveblocks_route_1 = __importDefault(require("./router/liveblocks.route"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const furl = process.env.FRONTEND_URL;
app.use((0, cors_1.default)({
    origin: furl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
    ],
}));
app.use("/auth", auth_routes_1.default);
app.use("/dashboard", dashboard_1.default);
app.use("/teams", teams_routes_1.default);
app.use("/documents", document_routes_1.default);
app.use("/tasks", tasks_routes_1.default);
app.use("/notifications", notification_routes_1.default);
app.use("/projects", project_routes_1.default);
app.use("/liveblocks", liveblocks_route_1.default);
const PORT = process.env.PORT || 5000;
// Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Listening On The Port ${PORT}`);
});
