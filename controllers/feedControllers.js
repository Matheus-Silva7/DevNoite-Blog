exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: "Primeiro post",
            content: "Este é o primeiro post!"
        }]
    })
}

exports.createPosts = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    //validação simples => verificar se os dados foram enviados corretamente
    if (!title || !content) {
        res.status(400).json({
            error: true,
            msg: "Você precisa enviar os dados corretamente"
        })
    }

    //ADD este post ao DB

    console.log(title)
    console.log(content)

    res.status(201).json({
        msg: "Post criado com sucesso!"
    })
}

exports.UpdatePost = (req, res, next) => {
    const postId = req.params.postId
    console.log(postId)
    res.status(200).json({
        msg: "Post atualizado com sucesso!",
        post: postId
    })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId
    console.log(postId)
    res.status(200).json({
        msg: "Post deletado com sucesso!",
        post: postId
    })
}