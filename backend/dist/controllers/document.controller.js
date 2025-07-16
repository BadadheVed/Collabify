"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserDocuments = exports.getDocumentsByTeam = exports.getDocumentsByProject = exports.getDocumentById = exports.deleteDocument = exports.createDocument = exports.SaveDocument = void 0;
var _db = require("../DB_Client/db");
var _notifications = require("../services/notifications.service");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// POST /teams/:teamId/documents - Create document in a specific team
var createDocument = exports.createDocument = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user;
    var teamId, title, userId, teamMember, newDoc, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          teamId = req.params.teamId;
          title = req.body.title;
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
          if (title) {
            _context.n = 2;
            break;
          }
          res.status(400).json({
            message: "Title is required"
          });
          return _context.a(2);
        case 2:
          _context.p = 2;
          _context.n = 3;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: teamId
            },
            include: {
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 3:
          teamMember = _context.v;
          if (teamMember) {
            _context.n = 4;
            break;
          }
          res.status(403).json({
            message: "You are not a member of this team."
          });
          return _context.a(2);
        case 4:
          _context.n = 5;
          return _db.db.document.create({
            data: {
              title: title,
              content: {},
              // empty object by default
              teamId: teamId,
              ownerId: userId
            },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 5:
          newDoc = _context.v;
          (0, _notifications.handleDocumentCreated)(userId, newDoc.id, newDoc.title);
          res.status(201).json({
            message: "Document created successfully",
            document: newDoc
          });
          return _context.a(2);
        case 6:
          _context.p = 6;
          _t = _context.v;
          console.error("Error creating document:", _t);
          res.status(500).json({
            message: "Internal server error"
          });
          return _context.a(2);
      }
    }, _callee, null, [[2, 6]]);
  }));
  return function createDocument(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// GET /documents/:id - Get a specific document
var getDocumentById = exports.getDocumentById = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$user2;
    var id, userId, document, isMember, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          id = req.params.id;
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
          return _db.db.document.findUnique({
            where: {
              id: id
            }
          });
        case 2:
          document = _context2.v;
          if (document) {
            _context2.n = 3;
            break;
          }
          res.status(404).json({
            message: "Document not found"
          });
          return _context2.a(2);
        case 3:
          _context2.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: document.teamId
            }
          });
        case 4:
          isMember = _context2.v;
          if (isMember) {
            _context2.n = 5;
            break;
          }
          res.status(403).json({
            message: "You are not authorized to access this document"
          });
          return _context2.a(2);
        case 5:
          // ✅ Return only the required fields
          res.status(200).json({
            document: {
              id: document.id,
              title: document.title,
              content: document.content
            },
            success: true
          });
          return _context2.a(2);
        case 6:
          _context2.p = 6;
          _t2 = _context2.v;
          console.error("Error fetching document:", _t2);
          res.status(500).json({
            message: "Server error"
          });
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 6]]);
  }));
  return function getDocumentById(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// GET /teams/:teamId/documents - Get all documents for a specific team
var getDocumentsByTeam = exports.getDocumentsByTeam = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$user3;
    var teamId, userId, teamMember, documents, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          teamId = req.params.teamId;
          userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
          if (userId) {
            _context3.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context3.a(2);
        case 1:
          _context3.p = 1;
          _context3.n = 2;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: teamId
            },
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                  project: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          });
        case 2:
          teamMember = _context3.v;
          if (teamMember) {
            _context3.n = 3;
            break;
          }
          res.status(403).json({
            message: "You are not a member of this team or team does not exist"
          });
          return _context3.a(2);
        case 3:
          _context3.n = 4;
          return _db.db.document.findMany({
            where: {
              teamId: teamId
            },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              updatedAt: "desc"
            }
          });
        case 4:
          documents = _context3.v;
          res.status(200).json({
            documents: documents,
            team: teamMember.team
          });
          return _context3.a(2);
        case 5:
          _context3.p = 5;
          _t3 = _context3.v;
          console.error("Error fetching documents by team:", _t3);
          res.status(500).json({
            message: "Server error"
          });
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 5]]);
  }));
  return function getDocumentsByTeam(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// GET /projects/:projectId/documents - Get all documents for all teams in a project
var getDocumentsByProject = exports.getDocumentsByProject = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$user4;
    var projectId, userId, project, projectTeamIds, isMember, documents, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          projectId = req.params.projectId;
          userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
          if (userId) {
            _context4.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          _context4.n = 2;
          return _db.db.project.findUnique({
            where: {
              id: projectId
            },
            include: {
              teams: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 2:
          project = _context4.v;
          if (project) {
            _context4.n = 3;
            break;
          }
          res.status(404).json({
            message: "Project not found"
          });
          return _context4.a(2);
        case 3:
          // Extract all team IDs related to the project
          projectTeamIds = project.teams.map(function (team) {
            return team.id;
          }); // Check if the user is a member of any of the project's teams
          _context4.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: {
                "in": projectTeamIds
              }
            }
          });
        case 4:
          isMember = _context4.v;
          if (isMember) {
            _context4.n = 5;
            break;
          }
          res.status(403).json({
            message: "Unauthorized"
          });
          return _context4.a(2);
        case 5:
          _context4.n = 6;
          return _db.db.document.findMany({
            where: {
              teamId: {
                "in": projectTeamIds
              }
            },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              updatedAt: "desc"
            }
          });
        case 6:
          documents = _context4.v;
          res.status(200).json({
            documents: documents,
            project: {
              id: project.id,
              name: project.name,
              teams: project.teams
            }
          });
          return _context4.a(2);
        case 7:
          _context4.p = 7;
          _t4 = _context4.v;
          console.error("Error:", _t4);
          res.status(500).json({
            message: "Server error"
          });
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return function getDocumentsByProject(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// PATCH /documents/:id - Update document content
var SaveDocument = exports.SaveDocument = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$user5;
    var id, content, userId, document, isMember, updatedDocument, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          id = req.params.id;
          content = req.body.content;
          userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
          if (userId) {
            _context5.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context5.a(2);
        case 1:
          _context5.p = 1;
          _context5.n = 2;
          return _db.db.document.findUnique({
            where: {
              id: id
            },
            include: {
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 2:
          document = _context5.v;
          if (document) {
            _context5.n = 3;
            break;
          }
          res.status(404).json({
            message: "Document not found"
          });
          return _context5.a(2);
        case 3:
          _context5.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: document.teamId
            }
          });
        case 4:
          isMember = _context5.v;
          if (isMember) {
            _context5.n = 5;
            break;
          }
          res.status(403).json({
            message: "Unauthorized"
          });
          return _context5.a(2);
        case 5:
          _context5.n = 6;
          return _db.db.document.update({
            where: {
              id: id
            },
            data: {
              content: content
            },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 6:
          updatedDocument = _context5.v;
          console.log("Saved Document Now at", Date.now());
          res.status(200).json({
            message: "Document updated successfully",
            document: updatedDocument
          });
          return _context5.a(2);
        case 7:
          _context5.p = 7;
          _t5 = _context5.v;
          console.error("Error updating document:", _t5);
          res.status(500).json({
            message: "Server error"
          });
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return function SaveDocument(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();

// DELETE /documents/:id - Delete a document
var deleteDocument = exports.deleteDocument = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _req$user6;
    var id, userId, document, isMember, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          id = req.params.id;
          userId = (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.id;
          if (userId) {
            _context6.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context6.a(2);
        case 1:
          _context6.p = 1;
          _context6.n = 2;
          return _db.db.document.findUnique({
            where: {
              id: id
            },
            include: {
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        case 2:
          document = _context6.v;
          if (document) {
            _context6.n = 3;
            break;
          }
          res.status(404).json({
            message: "Document not found"
          });
          return _context6.a(2);
        case 3:
          _context6.n = 4;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: document.teamId
            }
          });
        case 4:
          isMember = _context6.v;
          if (isMember) {
            _context6.n = 5;
            break;
          }
          res.status(403).json({
            message: "Unauthorized"
          });
          return _context6.a(2);
        case 5:
          _context6.n = 6;
          return _db.db.document["delete"]({
            where: {
              id: id
            }
          });
        case 6:
          res.status(200).json({
            message: "Document deleted successfully"
          });
          return _context6.a(2);
        case 7:
          _context6.p = 7;
          _t6 = _context6.v;
          console.error("Error deleting document:", _t6);
          res.status(500).json({
            message: "Server error"
          });
          return _context6.a(2);
      }
    }, _callee6, null, [[1, 7]]);
  }));
  return function deleteDocument(_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();
var getUserDocuments = exports.getUserDocuments = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var _req$user7, userId, documents, formattedDocuments, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          userId = (_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.id;
          if (userId) {
            _context7.n = 1;
            break;
          }
          res.status(401).json({
            message: "Unauthorized"
          });
          return _context7.a(2);
        case 1:
          _context7.n = 2;
          return _db.db.document.findMany({
            where: {
              team: {
                members: {
                  some: {
                    userId: userId
                  }
                }
              }
            },
            select: {
              id: true,
              title: true,
              content: true,
              updatedAt: true,
              createdAt: true,
              team: {
                select: {
                  name: true,
                  id: true
                }
              }
            }
          });
        case 2:
          documents = _context7.v;
          formattedDocuments = documents.map(function (d) {
            return {
              id: d.id,
              title: d.title,
              teamId: d.team.id,
              content: d.content,
              teamName: d.team.name,
              updatedAt: d.updatedAt.toISOString(),
              // Convert to string
              createdAt: d.createdAt.toISOString(),
              // Convert to string
              type: "markdown" // Add default type
            };
          });
          console.log("Found ".concat(formattedDocuments.length, " documents for user ").concat(userId));
          res.status(200).json({
            success: true,
            documents: formattedDocuments
          });
          _context7.n = 4;
          break;
        case 3:
          _context7.p = 3;
          _t7 = _context7.v;
          console.error("Error fetching user documents:", _t7);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });
        case 4:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 3]]);
  }));
  return function getUserDocuments(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();
//# sourceMappingURL=document.controller.js.map