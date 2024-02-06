const express = require("express")


const app = express()
const port = 8080
const feedRoutes = require("./routes/feedRouter")
const authRoutes = require("./routes/authRoutes")


//Json parser do express - middleware para captar o json do cliente
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '#');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
})



//este middleware vai captar todas as rotas do feedRoutes
app.use("/feed", feedRoutes)
app.use("/auth", authRoutes)

app.listen(port, () => {
    console.log("servidor online... porta:" + port)
})