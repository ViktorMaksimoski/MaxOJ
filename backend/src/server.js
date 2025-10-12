import express from 'express'

const PORT = 5001;
const app = express();

//middlewares
app.use(express.json())

//start server
app.listen(5001, () => {
    console.log(`App running on port ${PORT}`)
})