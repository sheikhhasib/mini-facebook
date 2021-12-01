const { makeToken, authenticate } = require("../helpers/utils");
const friendCollectionModel = require("../models/friendCollection");
const friendshipModal = require("../models/friendship");
const userModel = require("../models/user");

module.exports = {
  requestSend: async (req, res) => {
    try {
      const { from, to } = req.body;
      const { sessiontoken } = req.headers;
      let proceed = true;

      if ((await authenticate(from, sessiontoken)) === false) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Session Token Mismatched",
          },
        });
      }
      let checkFriendStatus1 = await friendshipModal
        .find({
          person: to,
          friend: from,
          status: "active",
        });
      if (checkFriendStatus1.length === 1) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Already Friend",
          },
        });
      }
      let checkFriendStatus2 = await friendshipModal
        .find({
          person: from,
          friend: to,
          status: "active",
        });
      if (checkFriendStatus2.length === 1) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Already Friend",
          },
        });
      }
      let checkPendingRequest1 = await friendCollectionModel
        .find({ from: from, to: to, type: "friendRequest" })
        .sort({ createdAt: "desc" })
        .limit(1)
        .exec();
      if (checkPendingRequest1.length === 1) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Already Request Send",
          },
        });
      }
      let checkPendingRequest2 = await friendCollectionModel
        .find({ from: to, to: from, type: "friendRequest" })
        .sort({ createdAt: "desc" })
        .limit(1)
        .exec();
      if (checkPendingRequest2.length === 1) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Already Request Send",
          },
        });
      }
      if (proceed) {
        const requestSend = new friendCollectionModel({
          token: makeToken({ label: "friendRequest" }),
          from: from,
          to: to,
          type: "friendRequest",
          actionTime: "hi",
        });
        await requestSend.save();
        res.send({
          type: "success",
          data: {
            message: "Friend Request Send",
          },
        });
      }
    } catch (error) {
      res.send({
        type: "error",
        data: error,
      });
    }
  },
  allPendingRequest: async (req, res) => {
    try {
      const allPendingRequest = await friendCollectionModel.find({});
      let userList = [];
      for (let i = 0; i < allPendingRequest.length; i++) {
        let thisUser = allPendingRequest[i];
        let newUser = {};
        let fromUser = await userModel.find({ userToken: thisUser.from });
        let toUser = await userModel.find({ userToken: thisUser.to });
        let fromData = fromUser[0];
        let toData = toUser[0];
        newUser = {
          token: thisUser.token,
          fromToken: fromData.token,
          fromFirstName: fromData.firstName,
          fromLastName: fromData.lastName,
          toToken: toData.token,
          toFirstName: toData.firstName,
          toLastName: toData.lastName,
          type: thisUser.type,
          actionTime: thisUser.actionTime,
        };
        userList.push(newUser);
      }
      res.send({
        type: "success",
        data: {
          items: userList,
          message: "All Friend Request",
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        type: "error",
        data: error,
      });
    }
  },
  pendingRequestOfAnUser: async (req, res) => {
      try {
        let proceed = true;
        const {token} = req.params;
        const {sessiontoken} = req.headers;

        if ((await authenticate(token, sessiontoken)) === false) {
          proceed = false;
          res.send({
            type: "error",
            data: {
              message: "Session Token Mismatched",
            },
          });
        }
        const pendingRequest = await friendCollectionModel.find({from : token});
        let userList = [];
        for (let i = 0; i < pendingRequest.length; i++) {
          let thisUser = pendingRequest[i];
          let newUser = {};
          let fromUser = await userModel.find({ userToken: thisUser.from });
          let fromData = fromUser[0];
          newUser = {
            token: thisUser.token,
            fromToken: fromData.userToken,
            fromFirstName: fromData.firstName,
            fromLastName: fromData.lastName,
            type: thisUser.type,
            actionTime: thisUser.actionTime,
          };
          userList.push(newUser);
        }
        res.send({
            type: "success",
            data: {
            items: userList,
            message: "All Pending Users",
            },
        })

      } catch (error) {
          
      }
  },
};
