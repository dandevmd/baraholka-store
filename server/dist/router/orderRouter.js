"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const isAuth_1 = require("../middlewares/isAuth");
const isOwner_1 = require("../middlewares/isOwner");
const orderRouter = (0, express_1.Router)();
orderRouter.post("/", isAuth_1.verifyToken, orderController_1.orderController.createOrder);
orderRouter.get("/", isAuth_1.verifyToken, orderController_1.orderController.getAllOrders);
orderRouter.get("/:id", isOwner_1.isOwner, orderController_1.orderController.getOrderById);
orderRouter.put("/:id/pay", isOwner_1.isOwner, orderController_1.orderController.updateOrderToPaid);
exports.default = orderRouter;
