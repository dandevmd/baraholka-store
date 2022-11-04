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
exports.productController = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
class ProductController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield productModel_1.default.find();
                res.send(products);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    getProductBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            try {
                const product = yield productModel_1.default.findOne({ slug });
                console.log(product);
                product && res.send(product);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield productModel_1.default.findById(id);
                product && res.send(product);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    getProductCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield productModel_1.default.find().distinct("category");
                res.send(categories);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
    getProductsByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = req.params;
            try {
                const products = yield productModel_1.default.find({ category });
                if (!products) {
                    throw new Error("No products found");
                }
                res.send(products);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                    console.log(error.message);
                }
                console.log(error);
            }
        });
    }
    getProductByQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req;
                const PAGE_SIZE = 3;
                const pageSize = query.pageSize || PAGE_SIZE;
                const page = query.page || 1;
                const category = query.category || "";
                const price = query.price || "";
                const rating = query.rating || "";
                const order = query.order || "";
                const searchQuery = query.query || "";
                const queryFilter = searchQuery && searchQuery !== "all"
                    ? {
                        name: {
                            $regex: searchQuery,
                            $options: "i",
                        },
                    }
                    : {};
                const categoryFilter = category && category !== "all" ? { category } : {};
                const ratingFilter = rating && rating !== "all"
                    ? {
                        rating: {
                            $gte: Number(rating),
                        },
                    }
                    : {};
                const priceFilter = price && price !== "all"
                    ? {
                        // 1-50
                        price: {
                            // @ts-ignore
                            $gte: Number(price.split("-")[0]),
                            // @ts-ignore
                            $lte: Number(price.split("-")[1]),
                        },
                    }
                    : {};
                const sortOrder = order === "featured"
                    ? { featured: -1 }
                    : order === "lowest"
                        ? { price: 1 }
                        : order === "highest"
                            ? { price: -1 }
                            : order === "toprated"
                                ? { rating: -1 }
                                : order === "newest"
                                    ? { createdAt: -1 }
                                    : { _id: -1 };
                const products = yield productModel_1.default.find(Object.assign(Object.assign(Object.assign(Object.assign({}, queryFilter), categoryFilter), priceFilter), ratingFilter))
                    .sort(
                // @ts-ignore
                sortOrder)
                    .skip(
                // @ts-ignore
                pageSize * (page - 1))
                    .limit(
                // @ts-ignore
                pageSize);
                const countProducts = yield productModel_1.default.countDocuments(Object.assign(Object.assign(Object.assign(Object.assign({}, queryFilter), categoryFilter), priceFilter), ratingFilter));
                res.send({
                    products,
                    countProducts,
                    page,
                    pages: Math.ceil(
                    //@ts-ignore
                    countProducts / pageSize),
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res
                        .status(500)
                        .send({ message: error.message, method: "getProductByQuery" });
                    console.log(error.message);
                }
                console.log(error);
            }
        });
    }
    createProductReview(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, rating, comment } = req.body;
            try {
                const product = yield productModel_1.default.findById(id);
                if (product) {
                    const alreadyReviewed = product.reviews && product.reviews.find((r) => r.name === name);
                    if (alreadyReviewed) {
                        res.status(400);
                        throw new Error("Product already reviewed");
                    }
                    const review = {
                        name,
                        rating: Number(rating),
                        comment,
                    };
                    product.reviews && product.reviews.push(review);
                    product.numReviews = product.reviews ? product.reviews.length : 0;
                    product.rating =
                        product.reviews &&
                            product.reviews.reduce((a, c) => c.rating + a, 0) /
                                product.reviews.length;
                    const updatedProduct = yield product.save();
                    res.status(201).send({
                        message: "Review added",
                        reviews: updatedProduct.reviews &&
                            updatedProduct.reviews[((_a = updatedProduct.reviews) === null || _a === void 0 ? void 0 : _a.length) - 1],
                        rating: product.rating,
                        numReviews: product.numReviews,
                    });
                }
                else {
                    res.status(404);
                    throw new Error("Product not found");
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
}
exports.productController = new ProductController();
