/* requirindo o express e iniciando o router (recurso do express) */
const express = require("express")
const router = express.Router()

/* importantando arquivos */

const feedController = require("../controllers/feedControllers")

/* criar as rotas relacionadas ao feed */
router.get("/posts", (feedController.getPosts))

module.exports = router