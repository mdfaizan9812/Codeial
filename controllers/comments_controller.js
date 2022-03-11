const Comment = require('../models/comment.js');
const Post = require('../models/post.js');


module.exports.create = function(req,res){
    // req.body.post is current post id for which a comment is created. This podt id send through with comment's form
    // which is type="hidden"
    Post.findById(req.body.post,function(err,post){  
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            },function(err,comment){
                // handle error later

                post.comments.push(comment);
                post.save();

                return res.redirect('/');
            })
        }
    })
}

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();
            Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}},function(err){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');   
        }
    });
}