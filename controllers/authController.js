const { validationResult } = require("express-validator");
const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//função para fazer o cadastro do usuario
exports.signUpUser = (req, res, next) => {
    const errors = validationResult(req);
    //Mudar esta validação para um captar no app
    //use, em todas as requisições!
    if (!errors.isEmpty()) {
        //Criei um objeto do tipo ERROR e adicionei (com os nomes que escolhi)
        //mais duas propriedades: data e statusCode
        const error = new Error("Falha de validação");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    //A senha está sendo salva em formato texto!!!
    //um problema!! Salvar ela criptografada!
    bcrypt.hash(password, 12).then(passHashed => {
        //Add este post ao DB
        const user = new User({
            email: email,
            name: name,
            password: passHashed,
        })

        user.save()
            .then(user => {

                user.password = undefined; // para nao devolver a senha
                res.status(201).json({
                    message: "User criado com sucesso!!",
                    result: user
                })
            }).catch(error => {
                res.status(500).json({
                    message: "Error ao salvar o user...",
                    result: error
                })
            })
    })
}

//função para fazer login do usuario caso ele exista
exports.signInUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    //Buscar user na base de dados com o email enviado
    await User.findOne({ email: email })
        .then(user => { //user é o que ele retorna
            //validar que email não existe na base
            if (!user) {
                const error = new Error("Falha de validação");
                error.statusCode = 422;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        }).then(passIsEqual => {
            if (!passIsEqual) {
                const error = new Error("Email ou senha inválida...");
                error.statusCode = 401;
                throw error;
            }

            //Vamos gerar o token para ele!
            const token = jwt.sign(
                {
                    userId: loadedUser._id.toString(),
                    name: loadedUser.name,
                    email: loadedUser.email,
                },
                "MinhaChaveJWT@2024Senai",
                { expiresIn: "1h" }
            )


            return res.status(200).json({
                message: "Usuário logado com sucesso!",
                token: token,
            })

        })
        .catch(error => {
            console.log(error)
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

//função para retornar os dados do usuario, quando ele estiver logado
exports.dataUser = (req, res, next) => {
    const userId = req.userId
    User.findById(userId)
        .then(loadedUser => {
            if (!loadedUser) {
                res.status(404).json({
                    message: "Usuario não encontrado"
                })
            } else {
                res.status(200).json({
                    loadedUser
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
}

//função para alterar o nome do usuario
exports.updateProfile = (req, res, next) => {
    const userID = req.userId;
    const name = req.body.name;
    console.log(userID);
    User.updateOne({ _id: userID }, { name: name })
        .then(
            res.status(200).json({
                message: "Nome atualizado com sucesso!",
                userId: userID
            }))
}

exports.changePassword = (req, res, next) => {
    const userId = req.userId
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword
    console.log(userId)
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error("Falha de validação");
                error.statusCode = 422;
                throw error;
            }
            return bcrypt.compare(currentPassword, user.password);
        })
        .then(passIsEqual => {
            if (!passIsEqual) {
                res.status(401).json({
                    message: "Senhas diferentes!"
                })
            }
            bcrypt.hash(newPassword, 12).then(newPasswordHashed => {

                User.updateOne({ _id: userId }, { password: newPasswordHashed })
                    .then(
                        res.status(200).json({
                            message: "Senha atualizada com sucesso!",
                            userId: userId
                        })
                    )
            })
        })
}

exports.deleteUser = (req, res, next) => {
    const userId = req.userId
    const password = req.body.password
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error("Falha de validação");
                error.statusCode = 422;
                throw error;
            }
            return bcrypt.compare(password, user.password);
        })
        .then(passIsEqual => {
            if (!passIsEqual) {
                res.status(401).json({
                    message: "Senhas incorreta!"
                })
            }
            
            User.deleteOne({ _id: userId })
                .then(
                    res.status(200).json({
                        message: "Usuário excluído com sucesso!",
                    })
                )
        })
}


