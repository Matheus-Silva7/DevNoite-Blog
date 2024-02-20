const {check, body} = require("express-validator")

module.exports = {
    validateEmail:check("email")
    .isEmail()
    .withMessage("Digite um email válido!"),
    /* .custom((value, { req }) => {
        if (value === "matheus@email.com") {
            throw new Error("Email já consta no banco de dados")
        }
        return true
    }),
 */
    validateTitle:body("title")
    .isLength({min:5})
    .withMessage("O titulo precisa de pelo menos 5 caracteres"),

    validatePassword:body("password")
    .isLength({min:8})
    .withMessage("A senha precisa de pelo menos 8 caracteres"),
    
    validateName:body("name")
    .isLength({min:3})
    .withMessage("O nome precisa comter pelo menos 3 caracteres")
}