"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserTeamsSummary = exports.getTileData = exports.getMyTeams = void 0;
var _db = require("../DB_Client/db");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var getTileData = exports.getTileData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user;
    var userId, userData, totalTeamMembers, totalTeamDocuments, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
          if (userId) {
            _context.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context.a(2);
        case 1:
          _context.p = 1;
          _context.n = 2;
          return _db.db.user.findUnique({
            where: {
              id: userId
            },
            select: {
              name: true,
              email: true,
              _count: {
                select: {
                  ProjectMember: true,
                  teams: true,
                  documents: true
                }
              },
              teams: {
                select: {
                  teamId: true,
                  team: {
                    select: {
                      _count: {
                        select: {
                          members: true,
                          documents: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        case 2:
          userData = _context.v;
          if (userData) {
            _context.n = 3;
            break;
          }
          res.status(404).json({
            message: "User not found"
          });
          return _context.a(2);
        case 3:
          // Flatten the counts
          totalTeamMembers = userData.teams.reduce(function (acc, tm) {
            return acc + tm.team._count.members;
          }, 0);
          totalTeamDocuments = userData.teams.reduce(function (acc, tm) {
            return acc + tm.team._count.documents;
          }, 0);
          res.status(200).json({
            name: userData.name,
            email: userData.email,
            projects: userData._count.ProjectMember,
            teams: userData._count.teams,
            teamMembers: totalTeamMembers,
            documents: totalTeamDocuments
          });
          return _context.a(2);
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.error("getTileData error:", _t);
          res.status(500).json({
            message: "Internal Server Error"
          });
          return _context.a(2);
      }
    }, _callee, null, [[1, 4]]);
  }));
  return function getTileData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getMyTeams = exports.getMyTeams = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$user2;
    var userId, teams, formatted, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
          if (userId) {
            _context2.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context2.a(2);
        case 1:
          _context2.p = 1;
          _context2.n = 2;
          return _db.db.team.findMany({
            where: {
              members: {
                some: {
                  userId: userId
                }
              }
            },
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          });
        case 2:
          teams = _context2.v;
          formatted = teams.map(function (team) {
            var _currentUser$role;
            var currentUser = team.members.find(function (m) {
              return m.userId === userId;
            });
            return {
              teamId: team.id,
              teamName: team.name,
              currentUserRole: (_currentUser$role = currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== null && _currentUser$role !== void 0 ? _currentUser$role : "MEMBER",
              // default fallback
              members: team.members.map(function (member) {
                return {
                  name: member.user.name,
                  role: member.role
                };
              })
            };
          });
          res.status(200).json({
            success: true,
            teams: formatted
          });
          return _context2.a(2);
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          console.error("Error fetching teams:", _t2);
          return _context2.a(2, res.status(500).json({
            message: "Internal server error"
          }));
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return function getMyTeams(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var getUserTeamsSummary = exports.getUserTeamsSummary = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$user3;
    var userId, teams, result, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
          if (userId) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(401).json({
            message: "Unauthorized"
          }));
        case 1:
          _context3.p = 1;
          _context3.n = 2;
          return _db.db.team.findMany({
            where: {
              members: {
                some: {
                  userId: userId
                }
              }
            },
            include: {
              members: {
                select: {
                  id: true
                } // just for counting
              }
            }
          });
        case 2:
          teams = _context3.v;
          result = teams.map(function (team) {
            return {
              id: team.id,
              name: team.name,
              membersCount: team.members.length
            };
          });
          res.status(200).json({
            success: true,
            teams: result
          });
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          console.error("Error:", _t3);
          res.status(500).json({
            message: "Internal server error"
          });
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 3]]);
  }));
  return function getUserTeamsSummary(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
//# sourceMappingURL=dashboard.controller.js.map