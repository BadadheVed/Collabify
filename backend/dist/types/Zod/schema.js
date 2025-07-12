"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignupSchema = exports.LoginSchema = void 0;
var _zod = require("zod");
var SignupSchema = exports.SignupSchema = _zod.z.object({
  email: _zod.z.string().email({
    message: "Invalid email address"
  }),
  password: _zod.z.string().min(6, {
    message: "Password must be at least 6 characters long"
  }).regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter"
  }).regex(/[0-9]/, {
    message: "Password must contain at least one number"
  })
});
var LoginSchema = exports.LoginSchema = _zod.z.object({
  email: _zod.z.string().email({
    message: "Invalid email address"
  }),
  password: _zod.z.string().min(1, {
    message: "Password is required"
  })
});
//# sourceMappingURL=schema.js.map