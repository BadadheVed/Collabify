"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSearch = exports.markNotificationAsRead = exports.markAllNotificationsAsRead = exports.getAuth = exports.UsersLive = exports.GetNotifications = void 0;
var _db = require("../DB_Client/db");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var GetNotifications = exports.GetNotifications = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user, userId, notifications, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
          if (userId) {
            _context.n = 1;
            break;
          }
          res.status(401).json({
            success: false,
            message: "Unauthorized"
          });
          return _context.a(2);
        case 1:
          _context.n = 2;
          return _db.db.notification.findMany({
            where: {
              userId: userId
            },
            orderBy: {
              createdAt: "desc"
            } // newest first
          });
        case 2:
          notifications = _context.v;
          res.status(200).json({
            success: true,
            notifications: notifications
          });
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          console.error("Error fetching notifications:", _t);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function GetNotifications(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

//PATCH /notifications/:id/mark-read

var markNotificationAsRead = exports.markNotificationAsRead = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$user2;
    var userId, id, notification, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
          id = req.params.id;
          _context2.p = 1;
          _context2.n = 2;
          return _db.db.notification.findUnique({
            where: {
              id: id
            }
          });
        case 2:
          notification = _context2.v;
          if (!(!notification || notification.userId !== userId)) {
            _context2.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Notification not found"
          });
          return _context2.a(2);
        case 3:
          _context2.n = 4;
          return _db.db.notification.update({
            where: {
              id: id
            },
            data: {
              read: true
            }
          });
        case 4:
          res.status(200).json({
            success: true,
            message: "Marked as read"
          });
          return _context2.a(2);
        case 5:
          _context2.p = 5;
          _t2 = _context2.v;
          console.error("Error marking notification as read:", _t2);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 5]]);
  }));
  return function markNotificationAsRead(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

//PATCH /notifications/mark-all-read

var markAllNotificationsAsRead = exports.markAllNotificationsAsRead = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$user3;
    var userId, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
          _context3.p = 1;
          _context3.n = 2;
          return _db.db.notification.updateMany({
            where: {
              userId: userId,
              read: false
            },
            data: {
              read: true
            }
          });
        case 2:
          res.status(200).json({
            success: true,
            message: "All notifications marked as read"
          });
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          console.error("Error marking all notifications as read:", _t3);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 3]]);
  }));
  return function markAllNotificationsAsRead(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var UsersLive = exports.UsersLive = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var userIds, ids, users, resolved, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          userIds = req.query.userIds;
          ids = Array.isArray(userIds) ? userIds : [userIds];
          _context4.n = 1;
          return _db.db.user.findMany({
            where: {
              id: {
                "in": ids
              }
            }
          });
        case 1:
          users = _context4.v;
          resolved = users.map(function (u) {
            return {
              id: u.id,
              info: {
                name: u.name,
                avatar: "https://ui-avatars.com/api/?name=".concat(encodeURIComponent(u.name), "&background=random&color=fff&rounded=true")
              }
            };
          });
          res.json(resolved);
          _context4.n = 3;
          break;
        case 2:
          _context4.p = 2;
          _t4 = _context4.v;
          console.error("Error resolving users:", _t4);
          res.status(500).send("Internal Server Error");
        case 3:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function UsersLive(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var userSearch = exports.userSearch = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var text, users, suggestions, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          text = req.query.text;
          if (text) {
            _context5.n = 1;
            break;
          }
          res.status(400).send("Missing search text");
          return _context5.a(2);
        case 1:
          _context5.n = 2;
          return _db.db.user.findMany({
            where: {
              name: {
                contains: text,
                mode: "insensitive"
              }
            },
            take: 5 // optional limit
          });
        case 2:
          users = _context5.v;
          suggestions = users.map(function (u) {
            return {
              id: u.id,
              info: {
                name: u.name,
                avatar: "https://ui-avatars.com/api/?name=".concat(encodeURIComponent(u.name), "&background=random&color=fff&rounded=true")
              }
            };
          });
          res.json(suggestions);
          _context5.n = 4;
          break;
        case 3:
          _context5.p = 3;
          _t5 = _context5.v;
          console.error("Error in user search:", _t5);
          res.status(500).send("Internal Server Error");
        case 4:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 3]]);
  }));
  return function userSearch(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
var getAuth = exports.getAuth = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _req$user4, userId, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
          if (!userId) {
            res.status(401).json({
              success: false
            });
          }
          res.status(200).json({
            success: true
          });
          return _context6.a(2);
        case 1:
          _context6.p = 1;
          _t6 = _context6.v;
          console.error("Error In Auth", _t6);
          res.status(500).send("Internal Server Error");
        case 2:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 1]]);
  }));
  return function getAuth(_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();
//# sourceMappingURL=user.controller.js.map