"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payPalController = void 0;
class PayPalController {
    getPayPalClientID(req, res) {
        return res.send(process.env.PAYPAL_CLIENT_ID || "sb");
    }
}
exports.payPalController = new PayPalController();
