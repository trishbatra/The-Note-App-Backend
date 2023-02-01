const mongoose = require('mongoose')
const mongoUri = `mongodb://localhost:27017/fullstackNoteApp?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
mongoose.set('strictQuery', false)
const connectToMongo  = () =>{
    mongoose.connect(mongoUri,()=>{
        console.log("connected to mongo")
    })
}
module.exports = {
    connectToMongo
}