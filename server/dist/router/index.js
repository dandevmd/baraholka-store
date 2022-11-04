"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productRouter_1 = __importDefault(require("./productRouter"));
const seedRouter_1 = __importDefault(require("./seedRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const orderRouter_1 = __importDefault(require("./orderRouter"));
const payPalRouter_1 = __importDefault(require("./payPalRouter"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
const uploadRouter_1 = __importDefault(require("./uploadRouter"));
const router = (0, express_1.Router)();
router.use("/seed", seedRouter_1.default);
router.use("/upload", uploadRouter_1.default);
router.use("/user", userRouter_1.default);
router.use('/admin', adminRouter_1.default);
router.use("/products", productRouter_1.default);
router.use('/orders', orderRouter_1.default);
router.use('/paypal', payPalRouter_1.default);
exports.default = router;
