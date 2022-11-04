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
exports.seedController = void 0;
const data_1 = __importDefault(require("../data"));
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class SeedController {
    constructor() {
        this.seed1 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.default.deleteMany({});
                const createdUsers = yield userModel_1.default.insertMany(data_1.default.users);
                yield productModel_1.default.deleteMany({});
                const createdProducts = yield productModel_1.default.insertMany(data_1.default.products);
                res.send({ createdProducts, createdUsers });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                }
            }
        });
    }
}
exports.seedController = new SeedController();
