const mongoose = require('mongoose');

// schema
const postSchema =new  mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        },
        user:{
            // linking to user model
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'  // user collection name
        }
    },
{
    timestamps:true
})
//model
const Post = mongoose.model('Post',postSchema);

module.exports = Post;