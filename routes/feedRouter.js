const express = require("express");
const router = express.Router();

const feedController = require("../controllers/feedControllers");
const { validateEmail, validateTitle } = require("../services/validators");

//Criar as rotas relacionadas ao feed

router.get('/posts', feedController.getPosts);
router.post('/post',
    [
        
            validateEmail, validateTitle
    ]
    , feedController.createPost);

router.patch("/post/:postID", feedController.updatePost);
router.delete("/post/:postID", feedController.deletePost);

module.exports = router;