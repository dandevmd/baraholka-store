"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).send("Access Denied");
        return next();
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // @ts-ignore
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(400).send("Invalid Token");
    }
};
exports.verifyToken = verifyToken;
const verifyAdmin = (req, res, next) => {
    var _a;
    const adminField = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[3];
    if (adminField === "true") {
        next();
    }
    else {
        res.status(401).send("Access Denied. Do not have admin privileges");
    }
};
exports.verifyAdmin = verifyAdmin;
