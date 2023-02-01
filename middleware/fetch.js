var jwt = require('jsonwebtoken')
const   JWT_SECRET = "sirftujantahai" 
function fetchUser (req,res,next){
    const token  = req.header('auth-token')
    if(!token){
        res.status(401).send("access denied")
    }
    try {
        const string = jwt.verify(token, JWT_SECRET)
        console.log(string)
        req.user  = string.user
        next()
    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    fetchUser
}