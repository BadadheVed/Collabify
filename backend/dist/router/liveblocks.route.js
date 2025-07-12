"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _roles = require("../middlewares/roles");
var _liveblocks = require("../controllers/liveblocks.controller");
var _user = require("../controllers/user.controller");
var liveblocksRouter = (0, _express.Router)();
liveblocksRouter.post("/auth", _roles.checkAuth, _liveblocks.authLiveblocks);
liveblocksRouter.get("/LiveUsers", _user.UsersLive);
liveblocksRouter.get("/searchUsers", _user.userSearch);
var _default = exports["default"] = liveblocksRouter;
//# sourceMappingURL=liveblocks.route.js.map