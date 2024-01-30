/* requirindo o express e iniciando o router (recurso do express) */
const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
/* importantando arquivos */

const feedController = require("../controllers/feedControllers")

/* criar as rotas relacionadas ao feed */
router.get("/post", (feedController.getPosts))
router.post("/post", (feedController.createPosts))
router.patch("/post/:postId", (feedController.UpdatePost))
router.delete("/post/:postId", (feedController.deletePost))

router.post(
    "/post",
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 })

    ],
    feedController.createPosts
)

module.exports = router