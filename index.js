const { connectToMongo } = require("./db");
const express = require('express')
const cors = require('cors')
const {userRouter} = require('./routes/auth')
const {notesRouter} = require('./routes/notes')
connectToMongo()
const app = express()
app.use(cors())
app.use(express.json())
const port = 5000
app.use('/api/auth',  userRouter )
app.use('/api/notes', notesRouter )
app.get('/', (req, res) => {
  res.send('Hello Trish!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})