"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const utils_1 = require("../utils");
class OrderController {
    constructor() {
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cart, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, fullName, address, city, country, postalCode, } = req.body;
            const orderItems = cart.map((item) => (Object.assign(Object.assign({}, item), { product: item._id })));
            const seller = orderItems.map((item) => item === null || item === void 0 ? void 0 : item.seller);
            const shippingAddress = {
                fullName,
                address,
                city,
                country,
                postalCode,
            };
            //@ts-ignore
            const { user } = req;
            const userDoc = yield userModel_1.default.findOne({ email: user.arg });
            const newOrder = new orderModel_1.default({
                orderItems,
                shippingAddress,
                paymentMethod,
                shippingPrice,
                taxPrice,
                totalPrice,
                itemsPrice,
                user: userDoc,
                seller,
            });
            try {
                const createdOrder = yield newOrder.save();
                if (!createdOrder) {
                    res.status(400).send("Order not created");
                }
                res.status(201).json(createdOrder);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.getOrderById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const order = yield orderModel_1.default.findById(id);
                if (!order) {
                    res.status(404).send("Order not found");
                }
                res.status(200).send(order);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.updateOrderToPaid = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const order = yield orderModel_1.default.findById(id).populate("user", "email name");
                console.log(order, "order>>>>>>>>>>>>>");
                if (!order) {
                    return res.status(400).send("Order not updated");
                }
                if (order) {
                    order.isPaid = true;
                    order.paidAt = new Date();
                    order.paymentResult = {
                        id: req.body.id,
                        status: req.body.status,
                        update_time: req.body.update_time,
                        email_address: req.body.payer.email_address,
                    };
                }
                const updatedOrder = yield (order === null || order === void 0 ? void 0 : order.save());
                (0, utils_1.mailgun)()
                    .messages()
                    .send({
                    from: "Baraholka <baraholka@mg.yourdomain.com>",
                    // @ts-ignore
                    to: `${order.user.name} <${order.user.email}>`,
                    subject: `New order ${order._id}`,
                    html: (0, utils_1.payOrderEmailTemplate)(order),
                }, (error, body) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(body);
                    }
                });
                return res.status(200).send(updatedOrder);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.getAllOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[2];
                if (!user) {
                    return res
                        .status(401)
                        .send({ message: "user not found", method: "getAllOrders" });
                }
                const ordersDocs = yield orderModel_1.default.find({ user });
                if (!ordersDocs) {
                    return res.status(404).send("Orders not found or are empty");
                }
                res.status(200).json(ordersDocs);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
    }
}
exports.orderController = new OrderController();
