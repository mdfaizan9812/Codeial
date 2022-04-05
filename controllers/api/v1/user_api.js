const User = require('../../../models/user.js');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment.js');

module.exports.createSession = async function(req,res){

    try{
        let user = await User.findOne({email:req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422,{
                message:"Invalid user and password"
            })
        }
        // if there is an user
        return res.json(200,{
            message:"Signed in successfully",
            data:{
                token: jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'1000000'})
            }
        })
    }catch(err){
        console.log('Error:--',err);
        return res.json(500,{
            message:"Internal server error"
        })
    }



}