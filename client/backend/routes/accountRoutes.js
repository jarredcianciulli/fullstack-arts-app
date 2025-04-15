const express = require("express");
const accountController = require("../controllers/accountController");
const accountAuthController = require("../controllers/accountAuthController");

const router = express.Router();

router.post(
  "/upload-profile",
  accountAuthController.protect,
  accountController.uploadUserPhoto,
  accountController.uploadProfilePicture
);

router.delete(
  "/delete-profile-photo",
  accountAuthController.protect,
  accountController.deleteProfilePicture
);
router.get("/profile-picture-url", accountController.getProfilePictureUrl);

router.post("/signup", accountAuthController.signup);
router.post("/login", accountAuthController.login);
router.get("/invite/:invite_token", accountAuthController.checkInviteToken);
router.get("/logout", accountAuthController.logout);
// router.get("/protect", accountAuthController.protect);
router.get("/checkSession", accountAuthController.checkSession);

router.post("/claim", accountAuthController.claimAccount);

router.post("/forgotPassword", accountAuthController.forgotPassword);
router.patch("/resetPassword/:resetToken", accountAuthController.resetPassword);

// Protect all routes after this middleware
router.use(accountAuthController.protect);

router.patch("/updateMyPassword", accountAuthController.updatePassword);
router.get("/me", accountController.getMe, accountController.getUser);
router.patch(
  "/updateMe",
  // accountController.uploadUserPhoto,
  // accountController.resizeUserPhoto,
  accountController.updateMe
);

router.delete("/deleteMe", accountController.deleteMe);

router.use(accountAuthController.restrictTo("admin", "owner"));

router
  .route("/")
  .get(accountController.getAllUsers)
  .post(accountController.createUser);

router
  .route("/:id")
  .get(accountController.getUser)
  .patch(accountController.updateUser)
  .delete(accountController.deleteUser);

router.post("/create", accountController.create);

module.exports = router;
