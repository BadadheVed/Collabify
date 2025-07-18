"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ioredis = _interopRequireDefault(require("ioredis"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  throw new Error("❌ REDIS_URL is not defined in environment variables");
}
var redisClient = new _ioredis["default"](REDIS_URL);
var _default = exports["default"] = redisClient;
//# sourceMappingURL=client.js.map