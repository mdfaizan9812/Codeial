const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

// creating post
module.exports.create = async (req,res)=>{
    try {
        await Post.create({
            content:req.body.content,
            user:req.user._id
        })
        
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
            post.remove();

            await Comment.deleteMany({post: req.params.id})

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