const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const Like = require('../models/like.js');
const commentsMailer = require('../mailers/comment_mailers.js');
const queue = require('../config/kue.js')
const commentEmailWorker = require('../workers/comment_email_worker.js')

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

            post.comments.push(comment)

            post.save();

            comment = await comment.populate('user','name email').execPopulate(); 
            // making email for comment
            // commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if(err){console.log("Error in sending to the queue",err); return}

                console.log(job.id);
            })

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Added!"
                });
            }

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
            
            // delete the likes associated with comment
            await Like.deleteMany({likeable:comment._id, onModel:'Comment'});


            if(req.xhr){
                console.log("ajax");
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    },
                    message:"Post deleted successfully"
                })
            }
            return res.redirect('back');
        }else{
            return res.redirect('back');   
        }
    } catch (err) {
        console.log("Error in commentController in destroy function", err);
        return;
    }
    
}