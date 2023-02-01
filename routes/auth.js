const express = require('express')
const { userModel } = require('../models/user')
const userRouter = express.Router()
const { body, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { fetchUser } = require('../middleware/fetch');
const   JWT_SECRET = "sirftujantahai" 

// ROUTE1 : user posting details 
userRouter.post("/createUser",[body('email').isEmail(),
body('password').isLength({ min: 5 }),
body('name').isLength({ min: 3})]
, async (req,res)=>{
    let success = false
    try {
    const errors  = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json({errors: errors.array(), success})
    }
    let exist  =await userModel.findOne({
        email: req.body.email
    })
    if( exist ){
        return res.status(400).json({ invalidMail: "this mail already exist sir", success })
    }
    const mysalt = await bcrypt.genSaltSync(10)
    const userPass = await bcrypt.hashSync(req.body.password, mysalt)
    let user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: userPass
      })
      const data = {
        user: {id : user.id}
      }
    const jwtDATA  = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({jwtDATA, success})
    } catch (error) {
        console.log(error)
        res.send(error.msg)
    }
    },)
// ROUTE2 : logging in the user
userRouter.post("/login", [body('email').isEmail
(), body('password').exists
() ], async (req,res)=>{
    let success = false
    const lafda = validationResult(req)
    if( !lafda.isEmpty() ){
        return res.json({lafda : lafda.array()})
    }
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json(
                {error: "internal server error", success}
                )
        }
        const valid = await bcrypt.compare(password, user.password)
        if(!valid){
            return res.status(400).json(
                {error: "internal server error check your entered fields again", success}
                )
        }
        const data = {
            user: {id : user.id}
          }
        const jwtDATA  = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({jwtDATA, success})
    } catch (error) {
        console.log(error)
        res.json({msg : error.msg})
    }
})
// ROUTE3: gettting the details of logged in user 
userRouter.post("/getUser", fetchUser ,async (req,res)=>{
    try {
        let userId  = req.user.id
        const user = await userModel.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server error")
    }
})
module.exports = {userRouter}
