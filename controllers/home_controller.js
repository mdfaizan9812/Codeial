const Post = require('../models/post.js')
const User = require('../models/user.js')

module.exports.home = function(req, res){
    
    // populate all user of the post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err,posts){
        User.find({},function(err,users){
            return res.render('home', {
                title: "Codial | Home",
                posts: posts,
                all_users: users
            });
        });
        
    })
    
}

// module.exports.actionName = function(req, res){}