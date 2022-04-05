const Post = require('../../../models/post.js');
const Comment = require('../../../models/comment.js');

module.exports.index = async (req,res)=>{

    let posts = await Post.find({})
        .sort('-createdAt') // used to put the post at top which created last and so on.
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
    });

    return res.json(200,{
        'message':'List of posts',
        'posts':posts
    })
}

// Deleting a post
module.exports.destroy= async(req,res)=>{

    try{
        // req.params.id is the id for post
        let post =await Post.findById(req.params.id)
        if(post.user == req.user.id){
            post.remove();
            
            // delete all comments associated with this comment
            await Comment.deleteMany({post:req.params.id})
            return res.json(200,{
                message:"This user has been deleted"
            })
        }else{
            return res.json(200,{
                message:"Unauthorized"
            })
        }
        
    }catch(err){
        console.log('***********',err);
        return res.json(500,{
            message:"Internal server error"
        })
    }
}   