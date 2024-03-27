
const { validationResult } = require("express-validator");
const Post = require('../models/post');
const User = require('../models/user')

//Ao posts, mandar aos poucos, ou seja, com paginação
exports.getPosts = (req, res, next) => {

    const page = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    Post.find()
        .countDocuments()
        .then(total => {
            totalItems = total;

            return Post.find()
                .skip((page - 1) * perPage)
                .limit(perPage);
        })
        .then(result => {
            res.status(200).json({
                totalItems: totalItems,
                posts: result
            })
        })
        .catch(error => {
            console.log(error);
        })

}

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            message: errors.array()[0].msg
        });
    }

    console.log("Aqui...")
    console.log(req.file)

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;

    //modificações para o post ser do usuário!
    let postCreator

    const postagem = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId, //posso acessar, pois adicionei essa propriedade no is-auth
    })

    //Add este post ao DB
    postagem.save()
        //fui na base de dados pegar o user
        .then(result => {
            return User.findById(req.userId)
        })
        //adicionei o post na lista de posts deste user
        .then(user => {
            postCreator = user
            user.posts.push(postagem)
            return user.save()
        })
        //devolvi a resposta!
        .then(result => {
            res.status(201).json({
                error: false,
                message: "Post criado com sucesso!!",
                creator: {
                    _id: postCreator._id,
                    name: postCreator.name
                }
            })
        })
}

//update post


exports.updatePost = (req, res, next) => {

    const postID = req.params.postID;
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;
    console.log(postID);
    Post.findById(postID)
        .then(post => {
            if (req.userId !== post.creator.toString()) {
                res.status(400).json({
                    msg: "Você não é o criador do post!"
                })
            }
            Post.updateOne({ _id: postID }, { title: title, content: content, imageUrl: imageUrl })
                .then(
                    res.status(200).json({
                        msg: "Post atualizado com sucesso!",
                        post: postID
                    }))
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "Ocorreu um erro ao atualizar o post" });
        });

}



//deletando post
exports.deletePost = (req, res, next) => {
    const postID = req.params.postID;
    console.log(postID);
    Post.findById(postID)
        .then(post => {
            if (req.userId !== post.creator.toString()) {
                res.status(400).json({
                    msg: "Você não é o criador do post!"
                })
            }
            Post.deleteOne({ _id: postID })
                .then(
                    res.status(200).json({
                        msg: "Post excluído com sucesso!",
                        post: postID
                    }))
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "Ocorreu um erro ao atualizar o post" });
        });
}


exports.addFavorite = (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postID;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Verifica se o post já está na lista de favoritos
            if (user.favorites.includes(postId)) {
                return res.status(400).json({ error: "Este post já está nos favoritos do usuário" });
            }

            // Adiciona o post à lista de favoritos do usuário
            user.favorites.push(postId);

            // Salva as alterações no usuário
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: "Post adicionado aos favoritos com sucesso!" });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "Ocorreu um erro ao adicionar o post aos favoritos" });
        });
};

exports.removeFavorite = (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postID;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            
            // Verifica se o post está na lista de favoritos
            const index = user.favorites.indexOf(postId);
            if (index !== -1) {
                // Remove o post da lista de favoritos do usuário
                user.favorites.splice(index, 1);
                // Salva as alterações no usuário
                return user.save();
            } else {
                return res.status(400).json({ error: "Este post não está na lista de favoritos do usuário" });
            }
        })
        .then(result => {
            res.status(200).json({ message: "Post removido dos favoritos com sucesso!" });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "Ocorreu um erro ao remover o post dos favoritos" });
        });
};