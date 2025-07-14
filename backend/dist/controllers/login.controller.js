"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.SignUp = void 0;
var _db = require("../DB_Client/db");
var _schema = require("../types/Zod/schema");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _Tokens = require("../types/Tokens");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// export const login: RequestHandler = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = LoginSchema.parse(req.body);
//     const User = await db.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (!User) {
//       res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, User.password);
//     if (!isMatch) {
//       res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//       return;
//     }
//     const payload = {
//       id: User.id,
//       email: User.email,
//       name: User.name,
//     };
//     const token = await generateToken(payload);
//     if (!token) {
//       res.status(500).json({
//         message: "Error Generating Token",
//         success: false,
//       });
//       return;
//     }
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.status(200).json({
//       message: "Logged In Successfully",
//       name: payload.name,
//       success: true,
//     });
//   } catch (error: any) {
//     if (error.name === "ZodError") {
//       res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: error.errors,
//       });
//       return;
//     }
//     console.error("Sign in error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
var login = exports.login = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _LoginSchema$parse, email, password, User, isMatch, payload, token, userName, isProduction, isDevelopment, cookieOptions, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _LoginSchema$parse = _schema.LoginSchema.parse(req.body), email = _LoginSchema$parse.email, password = _LoginSchema$parse.password;
          _context.n = 1;
          return _db.db.user.findUnique({
            where: {
              email: email
            }
          });
        case 1:
          User = _context.v;
          if (User) {
            _context.n = 2;
            break;
          }
          res.status(401).json({
            success: false,
            message: "Invalid email or password"
          });
          return _context.a(2);
        case 2:
          _context.n = 3;
          return _bcrypt["default"].compare(password, User.password);
        case 3:
          isMatch = _context.v;
          if (isMatch) {
            _context.n = 4;
            break;
          }
          res.status(401).json({
            success: false,
            message: "Invalid email or password"
          });
          return _context.a(2);
        case 4:
          payload = {
            id: User.id,
            email: User.email,
            name: User.name
          }; // Assuming you have validated the user and generated a token
          _context.n = 5;
          return (0, _Tokens.generateToken)(payload);
        case 5:
          token = _context.v;
          userName = User.name;
          console.log("Login successful, setting cookie...");
          console.log("Token:", token);
          console.log("Request origin:", req.headers.origin);
          console.log("Request host:", req.headers.host);

          // Determine if we're in production
          isProduction = process.env.NODE_ENV === "production";
          isDevelopment = !isProduction; // Cookie options
          cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            // Only secure in production
            sameSite: isProduction ? "none" : "lax",
            // 'none' for cross-origin in production
            maxAge: 24 * 60 * 60 * 1000,
            // 24 hours
            domain: isProduction ? undefined : undefined,
            // Let browser handle domain
            path: "/"
          };
          console.log("Cookie options:", cookieOptions);

          // Set the cookie
          res.cookie("token", token, cookieOptions);

          // Also set a test cookie to verify cookies are working
          res.cookie("test", "working", {
            httpOnly: false,
            // This one should be visible in devtools
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
          });
          console.log("Cookies set, sending response...");

          // Send response
          res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            name: userName,
            token: token // You might want to remove this in production for security
          });
          _context.n = 7;
          break;
        case 6:
          _context.p = 6;
          _t = _context.v;
          console.error("Login error:", _t);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });
        case 7:
          return _context.a(2);
      }
    }, _callee, null, [[0, 6]]);
  }));
  return function login(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var SignUp = exports.SignUp = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body, name, email, password, hashedPass, existingUser, newUser, payload, token, _t2, _t3, _t4, _t5;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          _t2 = _bcrypt["default"];
          _t3 = password;
          _context2.n = 1;
          return _bcrypt["default"].genSalt(10);
        case 1:
          _t4 = _context2.v;
          _context2.n = 2;
          return _t2.hash.call(_t2, _t3, _t4);
        case 2:
          hashedPass = _context2.v;
          _context2.n = 3;
          return _db.db.user.findUnique({
            where: {
              email: email
            }
          });
        case 3:
          existingUser = _context2.v;
          if (!existingUser) {
            _context2.n = 4;
            break;
          }
          res.status(409).json({
            success: false,
            message: "User already exists with this email"
          });
          return _context2.a(2);
        case 4:
          _context2.n = 5;
          return _db.db.user.create({
            data: {
              email: email,
              password: hashedPass,
              name: name
            }
          });
        case 5:
          newUser = _context2.v;
          payload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
          };
          _context2.n = 6;
          return (0, _Tokens.generateToken)(payload);
        case 6:
          token = _context2.v;
          if (token) {
            _context2.n = 7;
            break;
          }
          res.status(500).json({
            message: "Error Generating Response",
            success: false
          });
          return _context2.a(2);
        case 7:
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
          });
          res.status(201).json({
            token: token,
            message: "Sign Up Successful",
            name: payload.name,
            success: true
          });
          return _context2.a(2);
        case 8:
          _context2.p = 8;
          _t5 = _context2.v;
          console.error("Sign in error:", _t5);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return function SignUp(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=login.controller.js.map