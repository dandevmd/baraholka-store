import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { verifyToken, verifyAdmin, verifySeller } from "../middlewares/isAuth";

const adminRouter: Router = Router();

adminRouter.get("/stats", verifyToken, verifyAdmin, adminController.getStats);
adminRouter.get(
  "/productsList",
  verifyToken,
  verifyAdmin || verifySeller,
  adminController.getProductList
);
adminRouter.get(
  "/ordersList",
  verifyToken,
  verifyAdmin || verifySeller,
  adminController.getOrdersList
);
adminRouter.get(
  "/usersList",
  verifyToken,
  verifyAdmin,
  adminController.getUsersList
);
adminRouter.get(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  adminController.getUserById
);
adminRouter.post(
  "/createProduct",
  verifyToken,
  verifySeller || verifyAdmin,
  adminController.createNewProduct
);
adminRouter.put(
  "/editProduct/:id",
  verifyToken,
  verifyAdmin || verifySeller,
  adminController.editProduct
);
adminRouter.put(
  "/deliver/:id",
  verifyToken,
  verifyAdmin,
  adminController.deliverOrder
);
adminRouter.put(
  "/editUser/:id",
  verifyToken,
  verifyAdmin,
  adminController.editUser
);
adminRouter.delete(
  "/deleteProduct",
  verifyToken,
  verifySeller || verifyAdmin,
  adminController.deleteProduct
);
adminRouter.delete(
  "/deleteOrder",
  verifyToken,
  verifyAdmin,
  adminController.deleteOrder
);
adminRouter.delete(
  "/deleteUser",
  verifyToken,
  verifyAdmin,
  adminController.deleteUser
);

export default adminRouter;
