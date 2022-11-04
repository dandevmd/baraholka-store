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
exports.userController = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils");
class UserController {
    constructor() {
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //desc from body
                const { email, password } = req.body;
                if (!email || !password) {
                    return res
                        .status(400)
                        .send({ message: "Invalid Email and Password", method: "loginUser" });
                }
                //check candidate in db
                const candidate = yield userModel_1.default.findOne({ email });
                if (!candidate) {
                    return res
                        .status(400)
                        .send({ message: "User does not exist!", method: "loginUser" });
                }
                //check candidate password match
                const isMatch = yield bcryptjs_1.default.compare(password, candidate.password);
                if (!isMatch) {
                    return res
                        .status(400)
                        .send({ message: "Invalid Password", method: "loginUser" });
                }
                //generate token
                const token = (0, utils_1.generateToken)(candidate.email);
                //send right response
                const resp = {
                    message: "User logged in successfully",
                    _id: candidate._id,
                    name: candidate.name,
                    email: candidate.email,
                    isAdmin: candidate.isAdmin,
                    token,
                    isSeller: candidate.isSeller,
                    seller: Object.assign({}, candidate.seller)
                };
                res.status(200).json(resp);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                }
            }
        });
        this.registerUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { name, email, password } = req.body;
            //make sure all field all filled
            if (!name && !email && !password) {
                return res.status(400).send({
                    message: "Invalid Email and Password",
                    method: "registerUser",
                });
            }
            try {
                //make sure user with same credentials does not exist
                const candidate = yield userModel_1.default.findOne({ email });
                if (candidate) {
                    return res
                        .status(400)
                        .send({ message: "User already exist!", method: "registerUser" });
                }
                //salt and hash password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                //create new User
                const newUser = new userModel_1.default({
                    name,
                    email,
                    password: hashedPassword,
                });
                //save user to db
                const user = yield newUser.save();
                // if user is saved successfully, generate a token
                if (!user) {
                    return res
                        .status(400)
                        .send({ message: "Error in saving user", method: "registerUser" });
                }
                const token = (0, utils_1.generateToken)(user.email);
                //send right response
                const resp = {
                    message: "User registered successfully",
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token,
                    isSeller: user.isSeller,
                };
                res.status(200).json(resp);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                }
                console.log(error);
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[2];
            const { name, email, password, seller } = req.body;
            if (!name && !email) {
                return res.status(400).send({
                    message: "Invalid/Empty Email ",
                    method: "updateUser",
                });
            }
            try {
                const userToUpdate = yield userModel_1.default.findById(userId);
                if (!userToUpdate) {
                    return res
                        .status(400)
                        .send({ message: "User does not exist!", method: "updateUser" });
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                //in dependeta de db aici trebuie sa pastrezi datele vechi si sal le schimbi doar pe cele noi
                const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, {
                    name,
                    email,
                    password: password !== '' ? hashedPassword : userToUpdate.password,
                    seller: seller && Object.assign({}, seller),
                }, { new: true });
                if (!updatedUser) {
                    return res
                        .status(400)
                        .send({ message: "Error in updating user", method: "updateUser" });
                }
                const token = (0, utils_1.generateToken)(updatedUser.email, updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id);
                const resp = {
                    message: "User updated successfully",
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                    token,
                    isSeller: updatedUser.isSeller,
                };
                console.log(resp);
                res.status(200).json(resp);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                    console.log(error.message);
                }
                console.log(error);
            }
        });
    }
}
exports.userController = new UserController();
