"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authLiveblocks = void 0;
var _db = require("../DB_Client/db");
var _node = require("@liveblocks/node");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var liveblocks = new _node.Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY
});
var authLiveblocks = exports.authLiveblocks = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$user, _req$user2, _req$user3, userId, name, documentId, document, isTeamMember, roomId, session, _yield$session$author, body, status, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
          name = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.name;
          documentId = req.body.documentId;
          if (documentId) {
            _context.n = 1;
            break;
          }
          res.status(400).send("Missing documentId");
          return _context.a(2);
        case 1:
          if (userId) {
            _context.n = 2;
            break;
          }
          res.status(401).send("Missing user id");
          return _context.a(2);
        case 2:
          _context.n = 3;
          return _db.db.document.findUnique({
            where: {
              id: documentId
            },
            select: {
              id: true,
              teamId: true
            }
          });
        case 3:
          document = _context.v;
          if (document) {
            _context.n = 4;
            break;
          }
          res.status(404).send("Document not found");
          return _context.a(2);
        case 4:
          _context.n = 5;
          return _db.db.teamMember.findFirst({
            where: {
              userId: userId,
              teamId: document.teamId
            }
          });
        case 5:
          isTeamMember = _context.v;
          if (isTeamMember) {
            _context.n = 6;
            break;
          }
          res.status(403).send("User is not part of the document's team");
          return _context.a(2);
        case 6:
          roomId = "collabify:team:".concat(document.teamId, ":doc:").concat(document.id);
          session = liveblocks.prepareSession(userId, {
            userInfo: {
              name: (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.name,
              avatar: "https://ui-avatars.com/api/?name=".concat(encodeURIComponent(name !== null && name !== void 0 ? name : ""), "&background=random&color=fff&rounded=true")
            }
          });
          session.allow(roomId, session.FULL_ACCESS);
          _context.n = 7;
          return session.authorize();
        case 7:
          _yield$session$author = _context.v;
          body = _yield$session$author.body;
          status = _yield$session$author.status;
          res.status(status).send(body);
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          console.error("Liveblocks Auth Error:", _t);
          res.status(500).send("Internal server error");
        case 9:
          return _context.a(2);
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function authLiveblocks(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=liveblocks.controller.js.map