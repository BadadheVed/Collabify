"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _roles = require("../middlewares/roles");
var _login = require("../controllers/login.controller");
var _express = require("express");
var _user = require("../controllers/user.controller");
var LoginRouter = (0, _express.Router)();
LoginRouter.post("/login", _login.login);
LoginRouter.post("/signup", _login.SignUp);
LoginRouter.post("/me", _roles.checkAuth, _user.getAuth);
var _default = exports["default"] = LoginRouter;
//# sourceMappingURL=auth.routes.js.map