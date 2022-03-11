const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

// creating post
module.exports.create = (req,res)=>{
    Post.create({
        content:req.body.content,
        user:req.user._id
    },(err,data)=>{
        if(err){console.log("There is an error in storing post data in database"); return}
        return res.redirect('back');
    });
}

module.exports.destroy = function(req,res){
    Post.findById(req.params.id,function(err,post){
        // .id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    })
}