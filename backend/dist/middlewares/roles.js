"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkTeamMember = exports.checkAuth = exports.CheckProjectRoles = void 0;
var _express = require("express");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _db = require("../DB_Client/db");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var checkTeamMember = exports.checkTeamMember = function checkTeamMember(roles) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res, next) {
      var _req$user;
      var userId, teamId, member, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id; // ✅ already set by checkAuth
            teamId = req.params.teamId;
            if (!(!userId || !teamId)) {
              _context.n = 1;
              break;
            }
            res.status(400).json({
              message: "Missing user ID or project ID"
            });
            return _context.a(2);
          case 1:
            _context.p = 1;
            _context.n = 2;
            return _db.db.teamMember.findFirst({
              where: {
                userId: userId,
                teamId: teamId,
                role: {
                  "in": roles
                }
              }
            });
          case 2:
            member = _context.v;
            if (member) {
              _context.n = 3;
              break;
            }
            res.status(403).json({
              message: "Unauthorized Access"
            });
            return _context.a(2);
          case 3:
            next();
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            res.status(500).json({
              message: "Internal Server Error"
            });
            return _context.a(2);
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[1, 4]]);
    }));
    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};
var CheckProjectRoles = exports.CheckProjectRoles = function CheckProjectRoles(roles) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res, next) {
      var _req$user2;
      var userId, projectId, member, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id; // ✅ already set by checkAuth
            projectId = req.params.projectId;
            if (!(!userId || !projectId)) {
              _context2.n = 1;
              break;
            }
            res.status(400).json({
              message: "Missing user ID or project ID"
            });
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return _db.db.projectMember.findFirst({
              where: {
                userId: userId,
                projectId: projectId,
                role: {
                  "in": roles
                }
              }
            });
          case 2:
            member = _context2.v;
            if (member) {
              _context2.n = 3;
              break;
            }
            res.status(403).json({
              message: "Unauthorized Access"
            });
            return _context2.a(2);
          case 3:
            next();
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            res.status(500).json({
              message: "Internal Server Error"
            });
            return _context2.a(2);
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 4]]);
    }));
    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }();
};
var checkAuth = exports.checkAuth = function checkAuth(req, res, next) {
  console.log("🔍 Auth middleware called");
  console.log("🍪 All cookies:", req.cookies);
  console.log("📋 Headers:", req.headers.cookie);
  var token = req.cookies.token;
  if (!token) {
    console.log("❌ No token found in cookies");
    res.status(401).json({
      message: "No Token Found, Please Login again to Continue",
      success: false
    });
    return;
  }
  console.log("✅ Token found:", token.substring(0, 20) + "...");
  try {
    var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", {
      id: decoded.id,
      email: decoded.email
    });
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error);
    res.status(403).json({
      message: "Invalid Token",
      success: false
    });
    return;
  }
};
//# sourceMappingURL=roles.js.map