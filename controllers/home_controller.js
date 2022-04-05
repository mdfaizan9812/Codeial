const Post = require('../models/post.js')
const User = require('../models/user.js')

module.exports.home = async function(req, res){
    try {
        // populate all user of the post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');
        // let posts = await Post.find({})
        // .sort('-createdAt')     // for sorting posts, latest on top
        // .populate('user')
        // .populate({     // popupate comments and its users
        //     path : 'comments',
        //     populate : {
        //         path : 'user'
        //     },
        // })
        // .populate({     // to populate comments and its likes
        //     path:'comments',
        //     options : {
        //         sort : '-createdAt',    // to sort comments 
        //     },
        //     populate: {
        //         path:'likes'
        //     },
        // })
        // .populate('likes');
        // console.log("JSON.stringify(posts)",JSON.stringify(posts));
        let users = await User.find({});

        return res.render('home', {
            title: "Codial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log("Error in homeController", err);
        return; 
    }
    
    
    
}

