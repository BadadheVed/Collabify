"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserTeams = exports.getTeamMembers = exports.getAllMyProjects = exports.getAdminTeams = exports.getAdminProjects = exports.deleteProject = exports.ValidateInvite = exports.RejectInvite = exports.InviteByLink = exports.CreateTeam = exports.CreateProject = exports.AcceptInvite = void 0;
var _db = require("../DB_Client/db");
var _nanoid = require("nanoid");
var _notifications = require("../services/notifications.service");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // ✅ Corrected Controller Functions for Team & Project Management
var CreateTeam = exports.CreateTeam = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user, userId, _req$body, name, projectId, team, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
          _req$body = req.body, name = _req$body.name, projectId = _req$body.projectId;
          if (!(!name || !userId)) {
            _context.n = 1;
            break;
          }
          res.status(400).json({
            message: "Team name and user required."
          });
          return _context.a(2);
        case 1:
          _context.n = 2;
          return _db.db.team.create({
            data: {
              name: name,
              createdBy: userId,
              members: {
                create: {
                  userId: userId,
                  role: "ADMIN"
                }
              },
              projectId: projectId
            }
          });
        case 2:
          team = _context.v;
          res.status(201).json({
            success: true,
            message: "Team created successfully",
            teamId: team.id
          });
          return _context.a(2);
        case 3:
          _context.p = 3;
          _t = _context.v;
          console.error(_t);
          res.status(500).json({
            message: "Internal Server Error"
          });
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function CreateTeam(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var InviteByLink = exports.InviteByLink = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$user2, _req$body2, teamId, role, invitedById, token, expiresAt, invite, inviteLink, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body2 = req.body, teamId = _req$body2.teamId, role = _req$body2.role;
          invitedById = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
          if (invitedById) {
            _context2.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context2.a(2);
        case 1:
          token = (0, _nanoid.nanoid)();
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);
          _context2.n = 2;
          return _db.db.invite.create({
            data: {
              token: token,
              teamId: teamId,
              role: role,
              invitedById: invitedById,
              expiresAt: expiresAt,
              used: false
            }
          });
        case 2:
          invite = _context2.v;
          inviteLink = "".concat(process.env.FRONTEND_URL, "/join-team/").concat(token);
          res.status(201).json({
            success: true,
            message: "Invite link created successfully",
            inviteLink: inviteLink
          });
          return _context2.a(2);
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          console.error(_t2);
          res.status(500).json({
            message: "Server error"
          });
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return function InviteByLink(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var ValidateInvite = exports.ValidateInvite = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var token, invite, isExpired, isValid, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          token = req.params.token;
          _context3.p = 1;
          _context3.n = 2;
          return _db.db.invite.findUnique({
            where: {
              token: token
            },
            include: {
              team: {
                include: {
                  project: true
                }
              },
              invitedBy: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          });
        case 2:
          invite = _context3.v;
          if (invite) {
            _context3.n = 3;
            break;
          }
          res.status(404).json({
            success: false,
            message: "Invite not found"
          });
          return _context3.a(2);
        case 3:
          isExpired = new Date(invite.expiresAt) < new Date();
          isValid = !invite.used && !isExpired;
          res.status(200).json({
            success: true,
            invite: {
              id: invite.id,
              teamId: invite.teamId,
              teamName: invite.team.name,
              projectName: invite.team.project.name,
              inviterName: invite.invitedBy.name,
              inviterEmail: invite.invitedBy.email,
              role: invite.role,
              expiresAt: invite.expiresAt.toISOString(),
              createdAt: invite.createdAt.toISOString(),
              isValid: isValid,
              isExpired: isExpired
            }
          });
          return _context3.a(2);
        case 4:
          _context3.p = 4;
          _t3 = _context3.v;
          console.error(_t3);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 4]]);
  }));
  return function ValidateInvite(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var AcceptInvite = exports.AcceptInvite = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$user3;
    var token, userId, invite, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          token = req.params.token;
          userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
          if (userId) {
            _context4.n = 1;
            break;
          }
          res.status(401).json({
            success: false,
            message: "Login To Continue Joining"
          });
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          _context4.n = 2;
          return _db.db.invite.findUnique({
            where: {
              token: token
            },
            include: {
              team: {
                include: {
                  project: true
                }
              }
            }
          });
        case 2:
          invite = _context4.v;
          if (!(!invite || invite.used || new Date(invite.expiresAt) < new Date())) {
            _context4.n = 3;
            break;
          }
          res.status(410).json({
            success: false,
            message: "Invite expired or used"
          });
          return _context4.a(2);
        case 3:
          _context4.n = 4;
          return _db.db.teamMember.create({
            data: {
              userId: userId,
              teamId: invite.teamId,
              role: invite.role
            }
          });
        case 4:
          (0, _notifications.handleUserJoinTeam)(userId, invite.teamId);

          // Add to ProjectMember if not already present
          _context4.n = 5;
          return _db.db.projectMember.upsert({
            where: {
              userId_projectId: {
                userId: userId,
                projectId: invite.team.project.id
              }
            },
            update: {},
            create: {
              userId: userId,
              projectId: invite.team.project.id,
              role: "MEMBER"
            }
          });
        case 5:
          _context4.n = 6;
          return _db.db.invite.update({
            where: {
              token: token
            },
            data: {
              used: true,
              invitedUserId: userId
            }
          });
        case 6:
          res.status(200).json({
            success: true,
            message: "You've joined the team \"".concat(invite.team.name, "\"")
          });
          return _context4.a(2);
        case 7:
          _context4.p = 7;
          _t4 = _context4.v;
          console.error(_t4);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return function AcceptInvite(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var RejectInvite = exports.RejectInvite = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var token, invite, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          token = req.params.token;
          _context5.p = 1;
          _context5.n = 2;
          return _db.db.invite.findUnique({
            where: {
              token: token
            },
            include: {
              team: true
            }
          });
        case 2:
          invite = _context5.v;
          if (!(!invite || invite.used || new Date(invite.expiresAt) < new Date())) {
            _context5.n = 3;
            break;
          }
          res.status(410).json({
            success: false,
            message: "Invite expired or used"
          });
          return _context5.a(2);
        case 3:
          _context5.n = 4;
          return _db.db.invite.update({
            where: {
              token: token
            },
            data: {
              used: true
            }
          });
        case 4:
          res.status(200).json({
            success: true,
            message: "Invite to ".concat(invite.team.name, " rejected")
          });
          return _context5.a(2);
        case 5:
          _context5.p = 5;
          _t5 = _context5.v;
          console.error(_t5);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 5]]);
  }));
  return function RejectInvite(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
var CreateProject = exports.CreateProject = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _req$user4, _req$body3, name, description, userId, project, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _req$body3 = req.body, name = _req$body3.name, description = _req$body3.description;
          userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
          if (!(!userId || !name)) {
            _context6.n = 1;
            break;
          }
          res.status(400).json({
            message: "Missing required fields"
          });
          return _context6.a(2);
        case 1:
          _context6.n = 2;
          return _db.db.project.create({
            data: {
              name: name,
              description: description,
              createdById: userId
            }
          });
        case 2:
          project = _context6.v;
          (0, _notifications.handleProjectCreated)(userId, project.id, project.name);

          // ✅ Add the creator as ADMIN in projectMember table
          _context6.n = 3;
          return _db.db.projectMember.create({
            data: {
              userId: userId,
              projectId: project.id,
              role: "ADMIN" // assuming Role is enum
            }
          });
        case 3:
          res.status(201).json({
            success: true,
            project: project
          });
          return _context6.a(2);
        case 4:
          _context6.p = 4;
          _t6 = _context6.v;
          console.error("CreateProject Error:", _t6);
          res.status(500).json({
            message: "Internal Server Error"
          });
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 4]]);
  }));
  return function CreateProject(_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();
var getAllMyProjects = exports.getAllMyProjects = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var _req$user5;
    var userId, teamMemberships, directProjectMemberships, directRoleMap, _iterator, _step, membership, projectMap, _iterator2, _step2, teamMembership, team, project, directRole, effectiveRole, _iterator3, _step3, directMembership, _project, firstTeam, projects, _t7, _t8;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
          if (userId) {
            _context7.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context7.a(2);
        case 1:
          _context7.p = 1;
          console.log("Fetching projects for user:", userId);

          // Step 1: Get all team memberships for the user
          _context7.n = 2;
          return _db.db.teamMember.findMany({
            where: {
              userId: userId
            },
            include: {
              team: {
                include: {
                  project: {
                    include: {
                      createdBy: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        case 2:
          teamMemberships = _context7.v;
          console.log("Found ".concat(teamMemberships.length, " team memberships for user ").concat(userId));

          // Step 2: Get any direct project memberships (for admin roles, etc.)
          _context7.n = 3;
          return _db.db.projectMember.findMany({
            where: {
              userId: userId
            },
            select: {
              projectId: true,
              role: true
            }
          });
        case 3:
          directProjectMemberships = _context7.v;
          console.log("Found ".concat(directProjectMemberships.length, " direct project memberships"));

          // Create a map of projectId -> role for direct memberships
          directRoleMap = new Map();
          _iterator = _createForOfIteratorHelper(directProjectMemberships);
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              membership = _step.value;
              directRoleMap.set(membership.projectId, membership.role);
            }

            // Step 3: Process team memberships and build project list
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          projectMap = new Map();
          _iterator2 = _createForOfIteratorHelper(teamMemberships);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              teamMembership = _step2.value;
              team = teamMembership.team;
              project = team.project;
              if (project) {
                console.log("Processing project: ".concat(project.name, " (ID: ").concat(project.id, ")"));

                // Determine the user's role in this project
                // Priority: Direct ProjectMember role > TeamMember role
                directRole = directRoleMap.get(project.id);
                effectiveRole = directRole || teamMembership.role; // Only add if not already processed (avoid duplicates if user is in multiple teams of same project)
                if (!projectMap.has(project.id)) {
                  projectMap.set(project.id, {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    createdAt: project.createdAt,
                    createdBy: project.createdBy.name,
                    role: effectiveRole,
                    team: {
                      id: team.id,
                      name: team.name
                    }
                  });
                }
              } else {
                console.log("Team ".concat(team.name, " has no associated project"));
              }
            }

            // Step 4: Handle any direct project memberships that weren't covered by team memberships
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          _iterator3 = _createForOfIteratorHelper(directProjectMemberships);
          _context7.p = 4;
          _iterator3.s();
        case 5:
          if ((_step3 = _iterator3.n()).done) {
            _context7.n = 8;
            break;
          }
          directMembership = _step3.value;
          if (projectMap.has(directMembership.projectId)) {
            _context7.n = 7;
            break;
          }
          _context7.n = 6;
          return _db.db.project.findUnique({
            where: {
              id: directMembership.projectId
            },
            include: {
              createdBy: {
                select: {
                  name: true
                }
              },
              teams: {
                take: 1,
                // Get first team for display purposes
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 6:
          _project = _context7.v;
          if (_project) {
            firstTeam = _project.teams[0] || {
              id: "direct-access",
              name: "Direct Access"
            };
            projectMap.set(_project.id, {
              id: _project.id,
              name: _project.name,
              description: _project.description,
              createdAt: _project.createdAt,
              createdBy: _project.createdBy.name,
              role: directMembership.role,
              team: {
                id: firstTeam.id,
                name: firstTeam.name
              }
            });
          }
        case 7:
          _context7.n = 5;
          break;
        case 8:
          _context7.n = 10;
          break;
        case 9:
          _context7.p = 9;
          _t7 = _context7.v;
          _iterator3.e(_t7);
        case 10:
          _context7.p = 10;
          _iterator3.f();
          return _context7.f(10);
        case 11:
          projects = Array.from(projectMap.values());
          console.log("Returning ".concat(projects.length, " projects for user ").concat(userId));
          console.log("Projects:", projects.map(function (p) {
            return {
              id: p.id,
              name: p.name,
              role: p.role
            };
          }));
          res.status(200).json({
            success: true,
            projects: projects
          });
          return _context7.a(2);
        case 12:
          _context7.p = 12;
          _t8 = _context7.v;
          console.error("Error fetching user projects:", _t8);
          res.status(500).json({
            message: "Internal server error"
          });
          return _context7.a(2);
      }
    }, _callee7, null, [[4, 9, 10, 11], [1, 12]]);
  }));
  return function getAllMyProjects(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();
var deleteProject = exports.deleteProject = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var _req$user6, userId, projectId, project, authorizedTeamMember, _t9;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          userId = (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.id;
          projectId = req.params.projectId;
          if (!(!userId || !projectId)) {
            _context8.n = 1;
            break;
          }
          res.status(400).json({
            message: "Missing projectId or unauthorized"
          });
          return _context8.a(2);
        case 1:
          _context8.n = 2;
          return _db.db.project.findUnique({
            where: {
              id: projectId
            },
            include: {
              teams: {
                select: {
                  id: true
                }
              }
            }
          });
        case 2:
          project = _context8.v;
          if (project) {
            _context8.n = 3;
            break;
          }
          res.status(404).json({
            message: "Project not found"
          });
          return _context8.a(2);
        case 3:
          _context8.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: {
                "in": project.teams.map(function (team) {
                  return team.id;
                })
              },
              role: {
                "in": ["ADMIN", "MANAGER"]
              }
            }
          });
        case 4:
          authorizedTeamMember = _context8.v;
          if (authorizedTeamMember) {
            _context8.n = 5;
            break;
          }
          res.status(403).json({
            message: "Not authorized to delete this project"
          });
          return _context8.a(2);
        case 5:
          _context8.n = 6;
          return _db.db.project["delete"]({
            where: {
              id: projectId
            }
          });
        case 6:
          res.status(200).json({
            success: true,
            message: "Project deleted"
          });
          _context8.n = 8;
          break;
        case 7:
          _context8.p = 7;
          _t9 = _context8.v;
          console.error("Error deleting project:", _t9);
          res.status(500).json({
            message: "Internal Server Error"
          });
        case 8:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function deleteProject(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();
var getTeamMembers = exports.getTeamMembers = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var _req$user7;
    var userId, teamId, isMember, members, formatted, _t0;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          userId = (_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.id;
          teamId = req.params.teamId;
          if (!(!userId || !teamId)) {
            _context9.n = 1;
            break;
          }
          res.status(400).json({
            success: false,
            message: "Invalid request"
          });
          return _context9.a(2);
        case 1:
          _context9.p = 1;
          _context9.n = 2;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: teamId
            }
          });
        case 2:
          isMember = _context9.v;
          if (isMember) {
            _context9.n = 3;
            break;
          }
          res.status(403).json({
            success: false,
            message: "You are not authorized to view this team"
          });
          return _context9.a(2);
        case 3:
          _context9.n = 4;
          return _db.db.teamMember.findMany({
            where: {
              teamId: teamId
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          });
        case 4:
          members = _context9.v;
          formatted = members.map(function (member) {
            return {
              id: member.user.id,
              name: member.user.name,
              email: member.user.email,
              role: member.role
            };
          });
          res.status(200).json({
            success: true,
            members: formatted
          });
          return _context9.a(2);
        case 5:
          _context9.p = 5;
          _t0 = _context9.v;
          console.error("Error fetching team members:", _t0);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context9.a(2);
      }
    }, _callee9, null, [[1, 5]]);
  }));
  return function getTeamMembers(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();
var getUserTeams = exports.getUserTeams = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var _req$user8;
    var userId, teams, formatted, _t1;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          userId = (_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.id;
          if (userId) {
            _context0.n = 1;
            break;
          }
          res.status(401).json({
            success: false,
            message: "Unauthorized"
          });
          return _context0.a(2);
        case 1:
          _context0.p = 1;
          _context0.n = 2;
          return _db.db.teamMember.findMany({
            where: {
              userId: userId
            },
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true
                }
              }
            }
          });
        case 2:
          teams = _context0.v;
          formatted = teams.map(function (tm) {
            return {
              teamId: tm.team.id,
              teamName: tm.team.name,
              joinedAt: tm.joinedAt,
              role: tm.role
            };
          });
          res.status(200).json({
            success: true,
            teams: formatted
          });
          return _context0.a(2);
        case 3:
          _context0.p = 3;
          _t1 = _context0.v;
          console.error("Error fetching user teams:", _t1);
          res.status(500).json({
            success: false,
            message: "Server error"
          });
          return _context0.a(2);
      }
    }, _callee0, null, [[1, 3]]);
  }));
  return function getUserTeams(_x17, _x18) {
    return _ref0.apply(this, arguments);
  };
}();
var getAdminTeams = exports.getAdminTeams = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var _req$user9, userId, adminTeams, FinaladminTeams, _t10;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          // Get the user ID from the request (assuming it's from authentication middleware)
          userId = (_req$user9 = req.user) === null || _req$user9 === void 0 ? void 0 : _req$user9.id;
          if (userId) {
            _context1.n = 1;
            break;
          }
          res.status(401).json({
            error: "Unauthorized - User ID not found"
          });
          return _context1.a(2);
        case 1:
          _context1.n = 2;
          return _db.db.team.findMany({
            where: {
              members: {
                some: {
                  userId: userId,
                  role: {
                    "in": ["ADMIN", "MANAGER"]
                  }
                }
              }
            },
            select: {
              id: true,
              name: true,
              project: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            }
          });
        case 2:
          adminTeams = _context1.v;
          FinaladminTeams = adminTeams.map(function (team) {
            return {
              id: team.id,
              name: team.name,
              projectId: team.project.id,
              projectName: team.project.name
            };
          });
          res.status(200).json({
            success: true,
            teams: FinaladminTeams,
            count: adminTeams.length
          });
          return _context1.a(2);
        case 3:
          _context1.p = 3;
          _t10 = _context1.v;
          console.error("Error fetching admin teams:", _t10);
          res.status(500).json({
            error: "Internal server error",
            message: _t10.message
          });
          return _context1.a(2);
      }
    }, _callee1, null, [[0, 3]]);
  }));
  return function getAdminTeams(_x19, _x20) {
    return _ref1.apply(this, arguments);
  };
}();
var getAdminProjects = exports.getAdminProjects = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var _req$user0, userId, projects, _t11;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          userId = (_req$user0 = req.user) === null || _req$user0 === void 0 ? void 0 : _req$user0.id;
          if (userId) {
            _context10.n = 1;
            break;
          }
          res.status(401).json({
            error: "Unauthorized - User ID not found"
          });
          return _context10.a(2);
        case 1:
          _context10.n = 2;
          return _db.db.project.findMany({
            where: {
              ProjectMember: {
                some: {
                  userId: userId,
                  role: {
                    "in": ["ADMIN", "MANAGER"]
                  }
                }
              }
            },
            select: {
              id: true,
              name: true
            }
          });
        case 2:
          projects = _context10.v;
          res.status(200).json({
            success: true,
            projects: projects
          });
          return _context10.a(2);
        case 3:
          _context10.p = 3;
          _t11 = _context10.v;
          console.error("Error fetching admin projects:", _t11);
          res.status(500).json({
            error: "Internal server error"
          });
          return _context10.a(2);
      }
    }, _callee10, null, [[0, 3]]);
  }));
  return function getAdminProjects(_x21, _x22) {
    return _ref10.apply(this, arguments);
  };
}();
//# sourceMappingURL=teams.controller.js.map