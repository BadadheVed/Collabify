"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUserLeaveTeam = exports.handleUserJoinTeam = exports.handleProjectDeleted = exports.handleProjectCreated = exports.handleDocumentDeleted = exports.handleDocumentCreated = exports.TaskAssigned = void 0;
var _db = require("../DB_Client/db");
var _notificationPayload = require("./notificationPayload");
var _sockets = require("../sockets");
var _dateFns = require("date-fns");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Remove this line - don't call getIO() at module level
// const io = getIO();

var handleUserJoinTeam = exports.handleUserJoinTeam = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(teamId, userId) {
    var io, user, message, members, _iterator, _step, member, _t, _t2;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context.v;
          if (user) {
            _context.n = 2;
            break;
          }
          return _context.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("USER_JOINED_TEAM", {
            userName: user.name
          });
          _context.n = 3;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId,
              NOT: {
                userId: userId
              }
            },
            select: {
              userId: true
            }
          });
        case 3:
          members = _context.v;
          _iterator = _createForOfIteratorHelper(members);
          _context.p = 4;
          _iterator.s();
        case 5:
          if ((_step = _iterator.n()).done) {
            _context.n = 7;
            break;
          }
          member = _step.value;
          // Emit real-time notification
          io.to(member.userId).emit("notification", {
            message: message
          });

          // Save to DB
          _context.n = 6;
          return _db.db.notification.create({
            data: {
              userId: member.userId,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 6:
          _context.n = 5;
          break;
        case 7:
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          _iterator.e(_t);
        case 9:
          _context.p = 9;
          _iterator.f();
          return _context.f(9);
        case 10:
          _context.n = 12;
          break;
        case 11:
          _context.p = 11;
          _t2 = _context.v;
          console.error("Error in User Joining Team Notification Part:", _t2);
        case 12:
          return _context.a(2);
      }
    }, _callee, null, [[4, 8, 9, 10], [0, 11]]);
  }));
  return function handleUserJoinTeam(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var handleUserLeaveTeam = exports.handleUserLeaveTeam = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(teamId, userId) {
    var io, user, message, members, _iterator2, _step2, member, _t3, _t4;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context2.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context2.v;
          if (user) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("USER_LEFT_TEAM", {
            userName: user.name
          });
          _context2.n = 3;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId,
              NOT: {
                userId: userId
              }
            },
            select: {
              userId: true
            }
          });
        case 3:
          members = _context2.v;
          _iterator2 = _createForOfIteratorHelper(members);
          _context2.p = 4;
          _iterator2.s();
        case 5:
          if ((_step2 = _iterator2.n()).done) {
            _context2.n = 7;
            break;
          }
          member = _step2.value;
          io.to(member.userId).emit("notification", {
            message: message
          });
          _context2.n = 6;
          return _db.db.notification.create({
            data: {
              userId: member.userId,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 6:
          _context2.n = 5;
          break;
        case 7:
          _context2.n = 9;
          break;
        case 8:
          _context2.p = 8;
          _t3 = _context2.v;
          _iterator2.e(_t3);
        case 9:
          _context2.p = 9;
          _iterator2.f();
          return _context2.f(9);
        case 10:
          _context2.n = 12;
          break;
        case 11:
          _context2.p = 11;
          _t4 = _context2.v;
          console.error("Error in User Leaving Team Notification Part:", _t4);
        case 12:
          return _context2.a(2);
      }
    }, _callee2, null, [[4, 8, 9, 10], [0, 11]]);
  }));
  return function handleUserLeaveTeam(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var handleProjectCreated = exports.handleProjectCreated = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId, teamId, Pjname) {
    var io, user, message, members, _iterator3, _step3, member, _t5, _t6;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context3.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context3.v;
          if (user) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("PROJECT_CREATED", {
            userName: user.name,
            projectName: Pjname
          });
          _context3.n = 3;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId,
              NOT: {
                userId: userId
              }
            },
            select: {
              userId: true
            }
          });
        case 3:
          members = _context3.v;
          _iterator3 = _createForOfIteratorHelper(members);
          _context3.p = 4;
          _iterator3.s();
        case 5:
          if ((_step3 = _iterator3.n()).done) {
            _context3.n = 7;
            break;
          }
          member = _step3.value;
          io.to(member.userId).emit("notification", {
            message: message
          });
          _context3.n = 6;
          return _db.db.notification.create({
            data: {
              userId: member.userId,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 6:
          _context3.n = 5;
          break;
        case 7:
          _context3.n = 9;
          break;
        case 8:
          _context3.p = 8;
          _t5 = _context3.v;
          _iterator3.e(_t5);
        case 9:
          _context3.p = 9;
          _iterator3.f();
          return _context3.f(9);
        case 10:
          _context3.n = 12;
          break;
        case 11:
          _context3.p = 11;
          _t6 = _context3.v;
          console.error("Error in creating project Notification Part:", _t6);
        case 12:
          return _context3.a(2);
      }
    }, _callee3, null, [[4, 8, 9, 10], [0, 11]]);
  }));
  return function handleProjectCreated(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
var handleProjectDeleted = exports.handleProjectDeleted = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(userId, teamId, Pjname) {
    var io, user, message, members, _iterator4, _step4, member, _t7, _t8;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context4.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context4.v;
          if (user) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("PROJECT_DELETED", {
            userName: user.name,
            projectName: Pjname
          });
          _context4.n = 3;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId,
              NOT: {
                userId: userId
              }
            },
            select: {
              userId: true
            }
          });
        case 3:
          members = _context4.v;
          _iterator4 = _createForOfIteratorHelper(members);
          _context4.p = 4;
          _iterator4.s();
        case 5:
          if ((_step4 = _iterator4.n()).done) {
            _context4.n = 7;
            break;
          }
          member = _step4.value;
          io.to(member.userId).emit("notification", {
            message: message
          });
          _context4.n = 6;
          return _db.db.notification.create({
            data: {
              userId: member.userId,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 6:
          _context4.n = 5;
          break;
        case 7:
          _context4.n = 9;
          break;
        case 8:
          _context4.p = 8;
          _t7 = _context4.v;
          _iterator4.e(_t7);
        case 9:
          _context4.p = 9;
          _iterator4.f();
          return _context4.f(9);
        case 10:
          _context4.n = 12;
          break;
        case 11:
          _context4.p = 11;
          _t8 = _context4.v;
          console.error("Error in deleting project Notification Part:", _t8);
        case 12:
          return _context4.a(2);
      }
    }, _callee4, null, [[4, 8, 9, 10], [0, 11]]);
  }));
  return function handleProjectDeleted(_x8, _x9, _x0) {
    return _ref4.apply(this, arguments);
  };
}();
var handleDocumentCreated = exports.handleDocumentCreated = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId, teamId, DocTitle) {
    var io, user, message, members, _iterator5, _step5, member, _t9, _t0;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context5.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context5.v;
          if (user) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("DOCUMENT_CREATED", {
            userName: user.name,
            documentTitle: DocTitle
          });
          _context5.n = 3;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId,
              NOT: {
                userId: userId
              }
            },
            select: {
              userId: true
            }
          });
        case 3:
          members = _context5.v;
          _iterator5 = _createForOfIteratorHelper(members);
          _context5.p = 4;
          _iterator5.s();
        case 5:
          if ((_step5 = _iterator5.n()).done) {
            _context5.n = 7;
            break;
          }
          member = _step5.value;
          io.to(member.userId).emit("notification", {
            message: message
          });
          _context5.n = 6;
          return _db.db.notification.create({
            data: {
              userId: member.userId,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 6:
          _context5.n = 5;
          break;
        case 7:
          _context5.n = 9;
          break;
        case 8:
          _context5.p = 8;
          _t9 = _context5.v;
          _iterator5.e(_t9);
        case 9:
          _context5.p = 9;
          _iterator5.f();
          return _context5.f(9);
        case 10:
          _context5.n = 12;
          break;
        case 11:
          _context5.p = 11;
          _t0 = _context5.v;
          console.error("Error in Creating Document Notification Part:", _t0);
        case 12:
          return _context5.a(2);
      }
    }, _callee5, null, [[4, 8, 9, 10], [0, 11]]);
  }));
  return function handleDocumentCreated(_x1, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();
var handleDocumentDeleted = exports.handleDocumentDeleted = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId, teamId, DocTitle) {
    var io, user, message, members, _iterator6, _step6, member, _t1, _t10;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context6.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context6.v;
          if (user) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("DOCUMENT_DELETED", {
            userName: user.name,
            documentTitle: DocTitle
          });
          _context6.n = 3;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId,
              NOT: {
                userId: userId
              }
            },
            select: {
              userId: true
            }
          });
        case 3:
          members = _context6.v;
          _iterator6 = _createForOfIteratorHelper(members);
          _context6.p = 4;
          _iterator6.s();
        case 5:
          if ((_step6 = _iterator6.n()).done) {
            _context6.n = 7;
            break;
          }
          member = _step6.value;
          io.to(member.userId).emit("notification", {
            message: message
          });
          _context6.n = 6;
          return _db.db.notification.create({
            data: {
              userId: member.userId,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 6:
          _context6.n = 5;
          break;
        case 7:
          _context6.n = 9;
          break;
        case 8:
          _context6.p = 8;
          _t1 = _context6.v;
          _iterator6.e(_t1);
        case 9:
          _context6.p = 9;
          _iterator6.f();
          return _context6.f(9);
        case 10:
          _context6.n = 12;
          break;
        case 11:
          _context6.p = 11;
          _t10 = _context6.v;
          console.error("Error in Deleting Document Notification Part:", _t10);
        case 12:
          return _context6.a(2);
      }
    }, _callee6, null, [[4, 8, 9, 10], [0, 11]]);
  }));
  return function handleDocumentDeleted(_x12, _x13, _x14) {
    return _ref6.apply(this, arguments);
  };
}();
var TaskAssigned = exports.TaskAssigned = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId, taskTitle) {
    var io, user, message, _t11;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          io = (0, _sockets.getIO)(); // Get IO instance when function is called
          _context7.n = 1;
          return _db.db.user.findUnique({
            where: {
              id: userId
            }
          });
        case 1:
          user = _context7.v;
          if (user) {
            _context7.n = 2;
            break;
          }
          return _context7.a(2);
        case 2:
          message = (0, _notificationPayload.buildNotificationMessage)("TASK_ASSIGNED", {
            taskTitle: taskTitle
          });
          io.to(user.id).emit("notification", message);
          _context7.n = 3;
          return _db.db.notification.create({
            data: {
              userId: user.id,
              message: message,
              expiresAt: (0, _dateFns.addDays)(new Date(), 7)
            }
          });
        case 3:
          _context7.n = 5;
          break;
        case 4:
          _context7.p = 4;
          _t11 = _context7.v;
          console.error("Error in Task AssignmentNotification Part:", _t11);
        case 5:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 4]]);
  }));
  return function TaskAssigned(_x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}();
//# sourceMappingURL=notifications.service.js.map