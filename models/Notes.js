const mongoose = require('mongoose')
const notesSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    task : {
        type : String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    date : {
        type :Date,
        default: Date.now
    }
})
const noteModel = mongoose.model("note", notesSchema)
module.exports = {
    noteModel
}