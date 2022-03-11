const Post = require('../model/postModel.js');
const Comment = require('../model/commentModel.js');

// Creating a post
module.exports.create = async(req,res)=>{
    try{
        // it will return created data as well
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
        });

        // check ajax
        if(req.xhr){
            console.log('checking ajax in req.xhr');
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created"
            })
        }
        req.flash('success','Post published');
        return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        return;
    }
}

// Deleting a post
module.exports.destroy= async(req,res)=>{

    try{
        // req.params.id is the id for post
        let post =await Post.findById(req.params.id)

        // checkin authorized person
        // .id means converting the object _id into string
        if(post.user == req.user.id){
            post.remove();
            req.flash('success','Post deleted');
            // delete all comments associated with this comment
            let deleted = await Comment.deleteMany({post:req.params.id}) // deleted = { deletedCount: 0 }
            // check ajax
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"Post deleted successfully"
                })
            }
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error:-',err);
        return;
    }
}   





// creating post
// module.exports.create = (req,res)=>{
//     Post.create({
//         content:req.body.content,
//         user:req.user._id
//     },(err,data)=>{
//         if(err){console.log("There is an error in storing post data in database"); return}
//         return res.redirect('back');
//     })
// }

// deleting post
// module.exports.destroy=(req,res)=>{
//     // req.params.id is the id for post
//     Post.findById(req.params.id,(err,post)=>{
//         if(err){console.log("There is an error in getting the post in destroy function"); return}
//         // checkin authorized person
//         // .id means converting the object _id into string
//         if(post.user == req.user.id){
//             post.remove();
//             // delete all comments associated with this comment
//             Comment.deleteMany({post:req.params.id},(err)=>{
//                 if(err){console.log("There is an error in deleting all comment in destroy function"); return}
//                 return res.redirect('back');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     })
// }