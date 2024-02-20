const express = require("express")
const router = express.Router()

const authController = require("../controllers/authControllers")
const { validateName, validateEmail, validatePassword  } = require("../services/validators");

router.get("/singin", authController.getUser)

router.post("/singup", [validateName, validateEmail, validatePassword ], authController.createUser)

// router.get("/singin", authController.getUser)


module.exports = router;