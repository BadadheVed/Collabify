"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserTasks = exports.getProjectTeams = void 0;
var _db = require("../DB_Client/db");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// to get the user tasks
var getUserTasks = exports.getUserTasks = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user, userId, tasks, formattedTasks, _t;
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
          return _db.db.task.findMany({
            where: {
              assignedToId: userId
            },
            orderBy: {
              dueDate: "asc"
            },
            select: {
              id: true,
              title: true,
              status: true,
              dueDate: true,
              description: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  teams: {
                    select: {
                      id: true,
                      name: true
                    },
                    take: 1 // optional: just pick one team if multiple
                  }
                }
              }
            }
          });
        case 2:
          tasks = _context.v;
          formattedTasks = tasks.map(function (task) {
            var _task$project$teams$;
            return {
              id: task.id,
              title: task.title,
              status: task.status,
              dueDate: task.dueDate,
              description: task.description,
              projectName: task.project.name,
              teamName: ((_task$project$teams$ = task.project.teams[0]) === null || _task$project$teams$ === void 0 ? void 0 : _task$project$teams$.name) || "No Team Found"
            };
          });
          res.status(200).json({
            success: true,
            tasks: formattedTasks
          });
          return _context.a(2);
        case 3:
          _context.p = 3;
          _t = _context.v;
          console.error("Error fetching user tasks:", _t);
          res.status(500).json({
            success: false,
            message: "Internal Server Error"
          });
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function getUserTasks(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// to get teams by project
// GET /project/abc123/teams
//GET /project/abc123/teams?detailed=true this for when the tile is clicked

var getProjectTeams = exports.getProjectTeams = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var projectId, teams, formattedTeams, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          projectId = req.params.projectId;
          if (projectId) {
            _context2.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Project ID is required"
          });
          return _context2.a(2);
        case 1:
          _context2.p = 1;
          _context2.n = 2;
          return _db.db.team.findMany({
            where: {
              projectId: projectId
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
          formattedTeams = teams.map(function (team) {
            return {
              id: team.id,
              name: team.name,
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
            teams: formattedTeams
          });
          return _context2.a(2);
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          console.error("Error fetching project teams:", _t2);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return function getProjectTeams(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=tasks2.controller.js.map