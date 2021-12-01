const UserModel = require("../models/user");
const SessionModel = require("../models/session");
const argon2 = require("argon2");
const utils = require("../helpers/utils");
const moment = require("moment");

module.exports = {
  createUser: async function (req, res) {
    try {
      const { username, password, firstName, lastName, birthDate } = req.body;
      let proceed = true;
      const hashPassword = await argon2.hash(password);
      //unique username check
      let userCheck = await UserModel.find({ username: username });
      if (userCheck.length != 0) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "User Already exist",
          },
        });
      }
      if (proceed) {
        let newUser = new UserModel({
          userToken: utils.makeToken({ label: "user" }),
          username: username,
          password: hashPassword,
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
        });
        let newUserSave = await newUser.save();
        if (newUserSave) {
          res.send({
            type: "success",
            data: {
              message: "User Created Successfully",
            },
          });
        }
      }
    } catch (error) {
      res.send({
        type: "catch error",
        data: error,
      });
    }
  },
  loginUser: async function (req, res) {
    try {
      const { username, password } = req.body;
      let proceed = true;
      let userCheck = await UserModel.find({ username });

      if (userCheck.length == 1) {
        let matchPassword = await argon2.verify(
          userCheck[0].password,
          password
        );
        if (!matchPassword) {
          proceed = false;
          res.send({
            type: "error",
            data: {
              message: "Username or Password Not Matched",
            },
          });
        }
        if (proceed) {
          const newSession = new SessionModel({
            sessionToken: utils.makeToken({ label: "session" }),
            userToken: userCheck[0].userToken,
            ipAddress:
              req.headers["cf-connecting-ip"] ||
              req.headers["x-forwarded-for"] ||
              req.connection.remoteAddress,
            sessionEndedAt: "hi",
          });
          //save session token
          await newSession.save();
          res.send({
            type: "success",
            data: {
              sessionToken: newSession.sessionToken,
              userToken: newSession.userToken,
              message: "Your are Login Successfully!",
            },
          });
        }
      } else {
        res.send({
          type: "error",
          data: {
            message: "User Does Not Exits!",
          },
        });
      }
    } catch (error) {
      res.send({
        type: "errors",
        data: error,
      });
    }
  },
  logout: async (req, res) => {
    const { usertoken, sessiontoken } = req.headers;
    let proceed = true;
    if ((await utils.authenticate(usertoken, sessiontoken)) === false) {
      proceed = false;
      res.send({
        type: "error",
        data: {
          message: "You Are Not Logged In",
        },
      });
    }
    if (proceed) {
      let updateSession = await SessionModel.findOneAndUpdate(
        { sessionToken: sessiontoken },
        {
          $set: { sessionEndedAt: moment.utc().format("YYYY-MM-DD HH:mm:ss") },
        },
        { new: true }
      );
      res.send({
        type: "logout",
        data: {
          message: "User Logged Out Successfully",
        },
      });
    }
  },
};
