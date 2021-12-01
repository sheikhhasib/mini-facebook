const { makeToken, authenticate } = require("../helpers/utils");
const Post = require("../models/post");

module.exports = {
  createPost: async (req, res) => {
    try {
      const { postContent, privacy } = req.body;
      const { usertoken, sessiontoken } = req.headers;
      let proceed = true;
      if (await authenticate(usertoken, sessiontoken) === false) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Session Token Mismatched",
          },
        });
      }
      if (proceed) {
        let newPost = new Post({
          postToken: makeToken({ label: "post" }),
          postContent: postContent,
          privacy: privacy,
          userToken: usertoken,
          sessionToken: sessiontoken,
        });
        await newPost.save();

        res.send({
          type: "success",
          data: {
            message: "Post Created Successfully",
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
  getPost : async( req, res ) => {
    
  }
};
