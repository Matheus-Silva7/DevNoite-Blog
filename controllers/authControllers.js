const { validationResult } = require("express-validator")
const Users = require("../models/users")

exports.getUser = (req, res, next) => {

    Users.find()
        .then(results => {

            console.log(results)

            res.status(200).json({
                users: results
            })
        })

}

exports.createUser = (req, res, next) => {

    const errors = validationResult(req)

    console.log(errors)

    if (!errors.isEmpty()) {
        return res.status(422).send({
            error: true,
            message: errors.array()[0].msg
        })
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    if (!email || !password) {
        return res.status(400).json({
            error: true,
            msg: "Você precisa enviar os dados corretamente!!"
        })
    }

    if (password != confirmPassword) {
        return res.status(400).json({
            error: true,
            msg: "As senhas estão diferentes!!"
        })
    }
    //Add este post ao DB

    const user = new Users({
        name: name,
        email: email,
        password: password
    })

    user.save()
        .then(result => {

            console.log(result)

            res.status(201).json({
                error: false,
                message: "Usuario criado com sucesso!!",
                result: result
            })
        })
        .catch(error=>{
            res.status(500).json({
                error: true, 
                message: "Erro ao salvar o usuario",
                result: error
            })
        })

}