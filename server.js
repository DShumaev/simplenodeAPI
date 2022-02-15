const express = require('express')
const fileUpload = require('express-fileupload')
const mainRouter = require('./routers/router')


const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json({ extended: true }))
app.use(fileUpload({
    limits: { fileSize: 1 * 1028 * 1024 },
}))
app.use('/', mainRouter)

function start() {
    try {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    } catch (e) {
        console.log('Problem with starting HTTP server')
        process.exit(1)
    }
}


start()