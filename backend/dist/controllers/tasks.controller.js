"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTask = exports.getTasksForTeam = exports.deleteTask = exports.createAndAssignTask = exports.ChangeStatus = void 0;
var _db = require("../DB_Client/db");
var _notifications = require("../services/notifications.service");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var createAndAssignTask = exports.createAndAssignTask = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user, userId, _req$body, title, description, dueDate, teamId, assignedToId, team, isAdminOrManager, targetMember, task, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, dueDate = _req$body.dueDate, teamId = _req$body.teamId, assignedToId = _req$body.assignedToId;
          if (!(!userId || !title || !teamId || !assignedToId)) {
            _context.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Missing required fields (title, teamId, assignedToId)"
          });
          return _context.a(2);
        case 1:
          _context.n = 2;
          return _db.db.team.findUnique({
            where: {
              id: teamId
            },
            include: {
              project: true
            }
          });
        case 2:
          team = _context.v;
          if (team) {
            _context.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Team not found"
          });
          return _context.a(2);
        case 3:
          _context.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: teamId,
              role: {
                "in": ["ADMIN", "MANAGER"]
              }
            }
          });
        case 4:
          isAdminOrManager = _context.v;
          if (isAdminOrManager) {
            _context.n = 5;
            break;
          }
          res.status(403).json({
            success: false,
            message: "Only Admin or Manager can create tasks in this team"
          });
          return _context.a(2);
        case 5:
          _context.n = 6;
          return _db.db.teamMember.findFirst({
            where: {
              teamId: teamId,
              userId: assignedToId
            }
          });
        case 6:
          targetMember = _context.v;
          if (targetMember) {
            _context.n = 7;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Assigned user is not a member of this team"
          });
          return _context.a(2);
        case 7:
          _context.n = 8;
          return _db.db.task.create({
            data: {
              title: title,
              description: description,
              dueDate: dueDate ? new Date(dueDate) : undefined,
              projectId: team.projectId,
              // Get projectId from team
              assignedToId: assignedToId,
              assigneeId: userId // creator of the task
            }
          });
        case 8:
          task = _context.v;
          (0, _notifications.TaskAssigned)(userId, task.title);
          res.status(201).json({
            success: true,
            message: "Task created and assigned successfully",
            task: task
          });
          return _context.a(2);
        case 9:
          _context.p = 9;
          _t = _context.v;
          console.error("Error creating and assigning task:", _t);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });
          return _context.a(2);
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function createAndAssignTask(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// get tasks for a specific team
var getTasksForTeam = exports.getTasksForTeam = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$user2, userId, teamId, team, member, tasks, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
          teamId = req.params.teamId;
          if (!(!userId || !teamId)) {
            _context2.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Missing teamId or unauthorized"
          });
          return _context2.a(2);
        case 1:
          _context2.n = 2;
          return _db.db.team.findUnique({
            where: {
              id: teamId
            },
            include: {
              project: true
            }
          });
        case 2:
          team = _context2.v;
          if (team) {
            _context2.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Team not found"
          });
          return _context2.a(2);
        case 3:
          _context2.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              teamId: teamId,
              userId: userId,
              role: {
                "in": ["ADMIN", "MANAGER"]
              }
            }
          });
        case 4:
          member = _context2.v;
          if (member) {
            _context2.n = 5;
            break;
          }
          res.status(403).json({
            success: false,
            message: "Only Admin or Manager can view tasks of this team"
          });
          return _context2.a(2);
        case 5:
          _context2.n = 6;
          return _db.db.task.findMany({
            where: {
              projectId: team.projectId,
              assignedTo: {
                teams: {
                  some: {
                    teamId: teamId
                  }
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            },
            select: {
              id: true,
              title: true,
              description: true,
              dueDate: true,
              status: true,
              priority: true,
              createdAt: true,
              updatedAt: true,
              assignedTo: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 6:
          tasks = _context2.v;
          res.status(200).json({
            success: true,
            tasks: tasks
          });
          return _context2.a(2);
        case 7:
          _context2.p = 7;
          _t2 = _context2.v;
          console.error("Error fetching tasks:", _t2);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function getTasksForTeam(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// PATCH /api/tasks/:taskId
var updateTask = exports.updateTask = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$user3, userId, taskId, _req$body2, title, description, status, priority, dueDate, assignedToId, task, assignedUserTeam, isTeamMember, isAssignedUserInSameTeam, updatedTask, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
          taskId = req.params.taskId;
          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, status = _req$body2.status, priority = _req$body2.priority, dueDate = _req$body2.dueDate, assignedToId = _req$body2.assignedToId;
          if (!(!userId || !taskId)) {
            _context3.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Missing taskId or unauthorized"
          });
          return _context3.a(2);
        case 1:
          _context3.n = 2;
          return _db.db.task.findUnique({
            where: {
              id: taskId
            },
            include: {
              project: {
                include: {
                  teams: true
                }
              },
              assignedTo: {
                include: {
                  teams: true
                }
              }
            }
          });
        case 2:
          task = _context3.v;
          if (task) {
            _context3.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Task not found"
          });
          return _context3.a(2);
        case 3:
          // Find which team the assigned user belongs to in this project
          assignedUserTeam = task.assignedTo.teams.find(function (teamMember) {
            return task.project.teams.some(function (projectTeam) {
              return projectTeam.id === teamMember.teamId;
            });
          });
          if (assignedUserTeam) {
            _context3.n = 4;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Task's assigned user is not part of any team in this project"
          });
          return _context3.a(2);
        case 4:
          _context3.n = 5;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: assignedUserTeam.teamId
            }
          });
        case 5:
          isTeamMember = _context3.v;
          if (isTeamMember) {
            _context3.n = 6;
            break;
          }
          res.status(403).json({
            success: false,
            message: "You are not a member of the team that owns this task"
          });
          return _context3.a(2);
        case 6:
          if (!assignedToId) {
            _context3.n = 8;
            break;
          }
          _context3.n = 7;
          return _db.db.teamMember.findFirst({
            where: {
              userId: assignedToId,
              teamId: assignedUserTeam.teamId
            }
          });
        case 7:
          isAssignedUserInSameTeam = _context3.v;
          if (isAssignedUserInSameTeam) {
            _context3.n = 8;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Assigned user is not part of the same team"
          });
          return _context3.a(2);
        case 8:
          _context3.n = 9;
          return _db.db.task.update({
            where: {
              id: taskId
            },
            data: {
              title: title,
              description: description,
              status: status,
              priority: priority,
              dueDate: dueDate ? new Date(dueDate) : undefined,
              assignedToId: assignedToId || undefined
            }
          });
        case 9:
          updatedTask = _context3.v;
          res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask
          });
          return _context3.a(2);
        case 10:
          _context3.p = 10;
          _t3 = _context3.v;
          console.error("Error updating task:", _t3);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return function updateTask(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// DELETE /api/tasks/:taskId
var deleteTask = exports.deleteTask = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$user4, userId, taskId, task, assignedUserTeam, isAdminOrManager, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
          taskId = req.params.taskId;
          if (!(!userId || !taskId)) {
            _context4.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Missing taskId or unauthorized"
          });
          return _context4.a(2);
        case 1:
          _context4.n = 2;
          return _db.db.task.findUnique({
            where: {
              id: taskId
            },
            include: {
              project: {
                include: {
                  teams: true
                }
              },
              assignedTo: {
                include: {
                  teams: true
                }
              }
            }
          });
        case 2:
          task = _context4.v;
          if (task) {
            _context4.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Task not found"
          });
          return _context4.a(2);
        case 3:
          // Find which team the assigned user belongs to in this project
          assignedUserTeam = task.assignedTo.teams.find(function (teamMember) {
            return task.project.teams.some(function (projectTeam) {
              return projectTeam.id === teamMember.teamId;
            });
          });
          if (assignedUserTeam) {
            _context4.n = 4;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Task's assigned user is not part of any team in this project"
          });
          return _context4.a(2);
        case 4:
          _context4.n = 5;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: assignedUserTeam.teamId,
              role: {
                "in": ["ADMIN", "MANAGER"]
              }
            }
          });
        case 5:
          isAdminOrManager = _context4.v;
          if (isAdminOrManager) {
            _context4.n = 6;
            break;
          }
          res.status(403).json({
            success: false,
            message: "Only Admin or Manager can delete tasks in this team"
          });
          return _context4.a(2);
        case 6:
          _context4.n = 7;
          return _db.db.task["delete"]({
            where: {
              id: taskId
            }
          });
        case 7:
          res.status(200).json({
            success: true,
            message: "Task deleted successfully"
          });
          return _context4.a(2);
        case 8:
          _context4.p = 8;
          _t4 = _context4.v;
          console.error("Error deleting task:", _t4);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return function deleteTask(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// PATCH /tasks/status/:taskId
var ChangeStatus = exports.ChangeStatus = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$user5, _task$assignedTo, taskId, userId, status, task, assignedUserTeam, isAssignedUser, isAdminOrManager, updatedTask, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          taskId = req.params.taskId;
          userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
          status = req.body.status;
          if (!(!userId || !taskId || !status)) {
            _context5.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Missing required fields"
          });
          return _context5.a(2);
        case 1:
          _context5.n = 2;
          return _db.db.task.findUnique({
            where: {
              id: taskId
            },
            include: {
              project: {
                include: {
                  teams: true
                }
              },
              assignedTo: {
                select: {
                  id: true,
                  teams: true
                }
              }
            }
          });
        case 2:
          task = _context5.v;
          if (task) {
            _context5.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Task not found"
          });
          return _context5.a(2);
        case 3:
          // Find which team the assigned user belongs to in this project
          assignedUserTeam = task.assignedTo.teams.find(function (teamMember) {
            return task.project.teams.some(function (projectTeam) {
              return projectTeam.id === teamMember.teamId;
            });
          });
          if (assignedUserTeam) {
            _context5.n = 4;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Task's assigned user is not part of any team in this project"
          });
          return _context5.a(2);
        case 4:
          isAssignedUser = ((_task$assignedTo = task.assignedTo) === null || _task$assignedTo === void 0 ? void 0 : _task$assignedTo.id) === userId;
          _context5.n = 5;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: assignedUserTeam.teamId,
              role: {
                "in": ["ADMIN", "MANAGER", "MEMBER"]
              }
            }
          });
        case 5:
          isAdminOrManager = _context5.v;
          if (!(!isAssignedUser && !isAdminOrManager)) {
            _context5.n = 6;
            break;
          }
          res.status(403).json({
            success: false,
            message: "Only the assigned user or an Admin/Manager of the same team can change status"
          });
          return _context5.a(2);
        case 6:
          _context5.n = 7;
          return _db.db.task.update({
            where: {
              id: taskId
            },
            data: {
              status: status
            }
          });
        case 7:
          updatedTask = _context5.v;
          res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task: updatedTask
          });
          return _context5.a(2);
        case 8:
          _context5.p = 8;
          _t5 = _context5.v;
          console.error("Error updating task status:", _t5);
          res.status(500).json({
            success: false,
            message: "Internal Server Error"
          });
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 8]]);
  }));
  return function ChangeStatus(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
//# sourceMappingURL=tasks.controller.js.map