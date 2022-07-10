import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
    //verify token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //Get the user from Token
    req.user = await userModel.findById(userId).select("-password");
    next();
  }
  if (!token) {
    res.json({ status: "failed", message: "no token available" });
  }
};
export default checkUserAuth;
