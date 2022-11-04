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
exports.adminController = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class AdminController {
    constructor() {
        this.getStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const totalOrdersAndSales = yield orderModel_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            numOrders: { $sum: 1 },
                            totalSales: { $sum: "$totalPrice" },
                        },
                    },
                ]);
                const totalUsers = yield userModel_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            numUsers: { $sum: 1 },
                        },
                    },
                ]);
                const dailyOrders = yield orderModel_1.default.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            orders: { $sum: 1 },
                            sales: { $sum: "$totalPrice" },
                        },
                    },
                    {
                        $sort: {
                            _id: 1,
                        },
                    },
                ]);
                const productCategories = yield productModel_1.default.aggregate([
                    {
                        $group: {
                            _id: "$category",
                            count: { $sum: 1 },
                        },
                    },
                ]);
                if (totalOrdersAndSales.length === 0 ||
                    totalUsers.length === 0 ||
                    dailyOrders.length === 0 ||
                    productCategories.length === 0) {
                    res.status(400).send("No data found");
                }
                res.status(200).send({
                    totalOrders: totalOrdersAndSales[0].numOrders,
                    totalSales: totalOrdersAndSales[0].totalSales,
                    totalUsers: totalUsers[0].numUsers,
                    dailyOrders,
                    productCategories,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.getProductList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const page = Number(query.page) || 1;
                const pageSize = Number(query.pageSize) || 3;
                const products = yield productModel_1.default.find()
                    .skip(pageSize * (page - 1))
                    .limit(pageSize);
                const countDocuments = yield productModel_1.default.countDocuments();
                if (!products) {
                    res.status(400).send("No products found in getProductList method");
                }
                return res.status(200).send({
                    products,
                    countDocuments,
                    page,
                    pages: Math.ceil(countDocuments / pageSize),
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.createNewProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { product } = req.body;
            try {
                const newProduct = {
                    name: (product === null || product === void 0 ? void 0 : product.name) || "sample name" + Date.now(),
                    slug: (product === null || product === void 0 ? void 0 : product.slug) || "sample-slug-" + Date.now(),
                    category: (product === null || product === void 0 ? void 0 : product.category) || "sample category",
                    price: (product === null || product === void 0 ? void 0 : product.price) || 0,
                    image: (product === null || product === void 0 ? void 0 : product.image) || "/images/p1.jpg",
                    brand: (product === null || product === void 0 ? void 0 : product.brand) || "sample brand",
                    countInStock: (product === null || product === void 0 ? void 0 : product.countInStock) || 0,
                    rating: (product === null || product === void 0 ? void 0 : product.rating) || 0,
                    numReviews: (product === null || product === void 0 ? void 0 : product.numReviews) || 0,
                    description: (product === null || product === void 0 ? void 0 : product.description) || "sample description",
                };
                const createProduct = new productModel_1.default(newProduct);
                const savedProduct = yield createProduct.save();
                if (!savedProduct) {
                    res
                        .status(400)
                        .send("Error creating new product in createNewProduct method");
                }
                res.status(201).send(savedProduct);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.deleteProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const deletedProduct = yield productModel_1.default.findByIdAndDelete(id);
                if (!deletedProduct) {
                    res.status(400).send("Error deleting product in deleteProduct method");
                }
                res.status(200).send(deletedProduct);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
                res.send(error);
            }
        });
        this.editProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { _id, name, slug, category, price, image, images, brand, countInStock, rating, numReviews, description, } = req.body;
            try {
                const newProduct = {
                    name: name || "edited name" + Date.now(),
                    slug: slug || "edited-slug-" + Date.now(),
                    category: category || "edited category",
                    price: price || 0,
                    image: image || "/images/p2.jpg",
                    images: images || ["/images/p2.jpg", "/images/p3.jpg"],
                    brand: brand || "edited brand",
                    countInStock: countInStock || 0,
                    rating: rating || 0,
                    numReviews: numReviews || 0,
                    description: description || "edited description",
                };
                const updatedProduct = yield productModel_1.default.findByIdAndUpdate(_id, newProduct, { new: true });
                if (!updatedProduct) {
                    res.status(400).send("Error updating product in editProduct method");
                }
                res.status(200).send(updatedProduct);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.getOrdersList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const page = Number(query.page) || 1;
                const pageSize = Number(query.pageSize) || 3;
                const orders = yield orderModel_1.default.find()
                    .skip(pageSize * (page - 1))
                    .limit(pageSize);
                const countDocuments = yield orderModel_1.default.countDocuments();
                if (!orders) {
                    res.status(400).send("No products found in getProductList method");
                }
                res.status(200).send({
                    orders,
                    countDocuments,
                    page,
                    pages: Math.ceil(countDocuments / pageSize),
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.deliverOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const updatedOrder = yield orderModel_1.default.findByIdAndUpdate(id, { isDelivered: true, deliveredAt: Date.now() }, { new: true });
                if (!updatedOrder) {
                    res.status(400).send("Error delivering order in deliverOrder method");
                }
                res.status(200).send(updatedOrder);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.deleteOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const deletedOrder = yield orderModel_1.default.findByIdAndDelete(id);
                if (!deletedOrder) {
                    res.status(400).send("Error deleting product in deleteProduct method");
                }
                res.status(200).send(deletedOrder);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
                res.send(error);
            }
        });
        this.getUsersList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const page = Number(query.page) || 1;
            const pageSize = Number(query.pageSize) || 3;
            try {
                const users = yield userModel_1.default.find()
                    .skip(pageSize * (page - 1))
                    .limit(pageSize);
                if (!users) {
                    res.status(400).send("No products found in getProductList method");
                }
                res.status(200).send({
                    users,
                    countDocuments: users.length,
                    page,
                    pages: Math.ceil(users.length / pageSize),
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const deletedUser = yield userModel_1.default.findByIdAndDelete(id);
                if (!deletedUser) {
                    res.status(400).send("Error deleting user in deleteUsers method");
                }
                res.status(200).send(deletedUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
                res.send(error);
            }
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield userModel_1.default.findById(id);
                if (!user) {
                    res.status(400).send("Error getting user in getUserById method");
                }
                res.status(200).send(user);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
                res.send(error);
            }
        });
        this.editUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, email, isAdmin } = req.body;
            try {
                const editedUser = yield userModel_1.default.findByIdAndUpdate(id, { name, email, isAdmin }, { new: true });
                if (!editedUser) {
                    res.status(400).send("Error editing user in editUser method");
                }
                res.status(200).send(editedUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(500).send(error.message);
                }
                console.log(error);
            }
        });
    }
}
exports.adminController = new AdminController();
