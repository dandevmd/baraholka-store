"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payPalController_1 = require("../controllers/payPalController");
const payPalRouter = (0, express_1.Router)();
payPalRouter.get('/', payPalController_1.payPalController.getPayPalClientID);
exports.default = payPalRouter;
