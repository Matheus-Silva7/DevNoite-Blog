const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth = require("../controllers/authController");
const { validateEmail, validateName, validatePassword, validateEmailExists } = require("../services/validators");
const isAuth = require("../middlewares/is-auth");

router.post('/signup',[validateEmail, validateName, validatePassword, validateEmailExists], auth.signUpUser);
router.post('/signin',[validateEmail, validatePassword], auth.signInUser);

router.get("/profile", isAuth, auth.dataUser)

router.patch("/editProfile/:userID", auth.updateProfile)




module.exports = router;
