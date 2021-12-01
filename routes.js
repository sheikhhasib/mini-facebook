const express = require("express");
const UserController = require("./controllers/UserController");
const PostController = require("./controllers/PostController");
const FriendController = require("./controllers/FriendController");
const router = express.Router();


//user section 
router.post("/account/create", UserController.createUser);
router.post("/account/login", UserController.loginUser);
router.post("/account/logout", UserController.logout);

//post section
router.post("/post/create", PostController.createPost)


//friend section
router.post("/friend/request",FriendController.requestSend)
router.get("/friend/all",FriendController.allPendingRequest)
router.get("/friend/list/:token",FriendController.pendingRequestOfAnUser)


module.exports = router;