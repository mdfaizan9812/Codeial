const Comment = require('../models/comment.js');
const Post = require('../models/post.js');


module.exports.create = async function(req,res){
    // req.body.post is current post id for which a comment is created. This podt id send through with comment's form
    // which is type="hidden"
    try {
        let post = await Post.findById(req.body.post)
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            return res.redirect('/');
        }
    } catch (err) {
        console.log("Error in commentController in create function", err);
        return;
    }
}

module.exports.destroy = async function(req,res){
    try {
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();
            let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            return res.redirect('back');
        }else{
            return res.redirect('back');   
        }
    } catch (err) {
        console.log("Error in commentController in destroy function", err);
        return;
    }
    
}