"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const multer_1 = __importDefault(require("multer"));
const isAuth_1 = require("../middlewares/isAuth");
const upload = (0, multer_1.default)();
const uploadRouter = (0, express_1.Router)();
uploadRouter.post("/", isAuth_1.verifyToken, isAuth_1.verifyAdmin, upload.single("file"), uploadController_1.uploadController.uploadImage);
exports.default = uploadRouter;
