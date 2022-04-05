const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const User = require('../models/user.js')
const Like = require('../models/like.js');

// creating post
module.exports.create = async (req,res)=>{
    try {
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        post.user = await User.findById(req.user._id,{name:1});

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created"
            });
        }
        
        req.flash('success','Post Published!');
        return res.redirect('back');
    } catch (err) {
        req.flash('error',err);
        console.log("Error in postController in create function", err);
        return res.redirect('back'); 
    }
}

module.exports.destroy = async function(req,res){
    try {
        let post = await Post.findById(req.params.id);
    
        // .id means converting the object id into string
        if(post.user == req.user.id){
            // delete all the likes associated with the post
            await Like.deleteMany({likeable:post, onModel:'Post'}); // concept unclear
            await Like.deleteMany({_id: {$in: post.comments}});



            post.remove();

            await Comment.deleteMany({post: req.params.id})

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                });
            }

            req.flash('success','Post and associated comments deleted');
            return res.redirect('back');
        }else{
            req.flash('error','You can not delete this post');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',err);
        console.log("Error in postController in destroy function", err);
        return res.redirect('back'); 
    }
    
}