const {validationResult} = require("express-validator")

exports.getUser = (req, res, next) => {
    res.status(200).json({
        users: [
            {
                email: "joao@email.com",
                password: "12345678"
            }
        ]
    })
}

exports.createUser = (req, res, next) => {

    const errors = validationResult(req)

    console.log(errors)

    if (!errors.isEmpty()){
        return res.status(422).send({
            error:true, 
            message: errors.array()[0].msg
        })
    }

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            error: true,
            msg: "Você precisa enviar os dados corretamente!!"
        })
    }
    //Add este post ao DB

    res.status(201).json({
        error: false,
        message: "Usuario criado com sucesso!!"
    })
}