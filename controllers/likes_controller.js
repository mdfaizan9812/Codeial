const Like = require("../models/like.js");
const Comment = require("../models/comment.js");
const Post = require("../models/post.js");


module.exports.toggleLike = async function(req,res){
    try {
        // likes/toggle/?id=abcde&type=Post
        let likeable;
        let deleted = false;  // used to toggle i.e if false then -1 otherwise 1

        if(req.query.type == "Post"){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if a likes already exists
        let existingLike = await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });

        // if like is already exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted= true;
        }else{
            let newLike = await Like.create({
                user:req.user._id,
                likeable : req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message:"Request Successful",
            data:{
                deleted:deleted
            }
        })
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
}