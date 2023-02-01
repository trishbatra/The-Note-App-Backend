const express = require('express')
const { body, validationResult } = require('express-validator')
const { fetchUser } = require('../middleware/fetch')
const {noteModel} = require('../models/Notes')
const notesRouter = express.Router()
notesRouter.get("/fetchallnotes",fetchUser,async (req,res)=>{
    try {
        const notes = await noteModel.find({
            user : req.user.id
        })
        res.json({notes})
    } catch (error) {
        console.log(error)
    }
    
})
notesRouter.post("/addnotes",fetchUser ,async (req,res)=>{
    try {
        const {task,description} = req.body
        const note =   new noteModel({
            task,description,user : req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.log(error)
    }
   
})
notesRouter.put("/updatenote/:id", fetchUser , async (req,res)=>{
    try {
        let {task,description}  = req.body
        let updatedNote = {}
        if(task){updatedNote.task = task}
        if(description){updatedNote.description = description}
        // Find The Note 
        let noteToBeUpdated = await noteModel.findById(req.params.id)
        if(!noteToBeUpdated){
            return res.status(404).send("internal server error")
        }
        if(noteToBeUpdated.user.toString() != req.user.id){
            return res.status(404).send("Not allowed")
        }
         noteToBeUpdated  = await  noteModel.findByIdAndUpdate(req.params.id,{$set: updatedNote}, {new: true})
         res.json({noteToBeUpdated}) 
        // console.log(noteToBeUpdated)

    } catch (error) {
        console.log(error)
    }
    

})
notesRouter.delete("/deletenote/:id",fetchUser,async (req,res)=>{
    try {
        let noteToDelete = await noteModel.findById(req.params.id)
        if(!noteToDelete){
            res.send("no such note found")
        }
        if (noteToDelete.user.toString() !=  req.user.id ){
            return res.status(400).send("not allowed")
        }
        noteToDelete = await noteModel.findByIdAndDelete(req.params.id)
        res.send(noteToDelete)
    } catch (error) {
        console.log(error)
    }

})
module.exports = {notesRouter}