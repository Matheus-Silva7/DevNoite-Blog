const express = require("express")

const app = express()
const port = 8080
const feedRoutes = require("./routes/feedRouter")



app.use("/feed", feedRoutes)

app.listen(port, ()=>{
    console.log("servidor online... porta:"+port)
})