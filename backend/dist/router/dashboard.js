"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _dashboard = require("../controllers/dashboard.controller");
var _roles = require("../middlewares/roles");
//import { DashBoard } from "@/controllers/dashboard.controller";

var dashboard = (0, _express.Router)();
//ashboard.get("/", CheckRoles(["Admin"]), DashBoard);
dashboard.get("/tiledata", _roles.checkAuth, _dashboard.getTileData);
var _default = exports["default"] = dashboard;
//# sourceMappingURL=dashboard.js.map