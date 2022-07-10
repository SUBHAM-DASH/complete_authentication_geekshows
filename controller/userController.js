import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "./email/sendMail.js";

class UserController {
  //REGISTER USER
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confermation, tc } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      return res.json({ error: "email already exits" });
    }
    if (name && email && password && password_confermation && tc) {
      if (password == password_confermation) {
        try {
          let salt = await bcrypt.genSalt(10);
          let hashPassword = await bcrypt.hash(password, salt);
          const doc = new userModel({
            email: email,
            name: name,
            tc: tc,
            password: hashPassword,
          });
          let newUser = await doc.save();
          let token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );

          res.json({
            status: "seccess",
            message: "saved successfully",
            token: token,
          });
        } catch (error) {
          return res.json({ error: error.message });
        }
      } else {
        res.json({
          status: "failed",
          message: "password and confirm password does not match",
        });
      }
    } else {
      res.json({ status: "failed", message: "All fields are required" });
    }
  };

  //USER LOGIN
  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (email && password) {
        let user = await userModel.findOne({ email: email });
        if (!user) {
          res.json({ status: "failed", message: "user is not available" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch && email == user.email) {
          //Generate token
          let token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.json({
            status: "success",
            message: "successfully login",
            token: token,
          });
        } else {
          return res.json({ message: "email and password are not correct" });
        }
      }
    } catch (error) {
      return res.json({ error: error.message });
    }
  };

  //CHANGE PASSWORD
  static changeUserPassword = async (req, res) => {
    try {
      const { password, password_confermation } = req.body;
      if (password && password_confermation) {
        if (password !== password_confermation) {
          res.json({
            status: "failed",
            message: "sorry password and confirm password does not match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashpassword = await bcrypt.hash(password, salt);
          await userModel.findByIdAndUpdate(req.user._id, {
            $set: { password: newHashpassword },
          });
          res.json({ status: "success", message: "changed successfully" });
        }
      }
    } catch (error) {
      return res.json({ error: error.message });
    }
  };

  //LOGGEDIN USER DATA
  static loggedinUser = async (req, res) => {
    res.send(req.user);
  };

  //SEND EMAIL TO USER RESET THE PASSWORD
  static senduserPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;
      if (email) {
        let user = await userModel.findOne({ email: email });
        if (!user) {
          return res.json({ message: "user not found" });
        }
        console.log(req.user._id);
        console.log(user._id);
        const token = jwt.sign(
          { userId: user._id },
          req.user._id + process.env.JWT_SECRET_KEY,
          { expiresIn: "15m" }
        );
        const link = `http://127.0.0.1:4200/api/user/reset/${user._id}/${token}`;
        console.log(link);
        //Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "subham's shop",
          html: `<a href:${link}>Click Here</a> to reset your password`,
        });
        res.json({
          status: "success",
          message: "password sent to your mail... ! please check your mail",
          info: info,
        });
      } else {
        return res.json({ error: "email not found" });
      }
    } catch (error) {
      return res.json({ error: error.message });
    }
  };

  //RESET PASSWORD THROUGH LINK
  static userPasswordReset = async (req, res) => {
    try {
      const { password, password_confermation } = req.body;
      const { id, token } = req.params;
      const user = await userModel.findById(id);
      const new_secret = user._id + process.env.JWT_SECRET_KEY;
      try {
        jwt.verify(token, new_secret);
        if (password && password_confermation) {
          if (password !== password_confermation) {
            res.json({
              message: "new password and confirm password doesn't match",
            });
          } else {
            const salt = await bcrypt.genSalt(10);
            const newHashpassword = await bcrypt.hash(password, salt);
            await userModel.findByIdAndUpdate(user._id, {
              $set: { password: newHashpassword },
            });
            res.send({
              status: "success",
              message: "password changed successfully",
            });
          }
        } else {
          return res.json({ message: "All the fields are required" });
        }
      } catch (error) {
        return res.json({ error: error.message });
      }
    } catch (error) {
      return res.json({ error: error.message });
    }
  };
}
export default UserController;
