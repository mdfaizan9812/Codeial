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
        },
        // include the array of ids of all comments in this post schema itself
        comments:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Comment'
            }
        ],
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Like'
            }
        ]
    },
{
    timestamps:true
})
//model
const Post = mongoose.model('Post',postSchema);

module.exports = Post;