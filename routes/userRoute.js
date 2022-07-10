import express from "express";
const router = express.Router();
import UserController from "../controller/userController.js";
import checkUserAuth from "../middleware/jwtToken.js";

//Public Route
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post("/email-send-to-mail",checkUserAuth, UserController.senduserPasswordResetEmail);
router.post("/reset-password/:id/:token",UserController.userPasswordReset);

//Protected Route
router.post(
  "/changepassword",
  checkUserAuth,
  UserController.changeUserPassword
);
router.get("/loggedinuser", checkUserAuth, UserController.loggedinUser);

export default router;
