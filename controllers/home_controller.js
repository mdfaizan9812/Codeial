const Post = require('../models/post.js')
const User = require('../models/user.js')

module.exports.home = async function(req, res){
    try {
        // populate all user of the post
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

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

