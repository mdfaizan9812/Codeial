const mongoose = require('mongoose');

// schema
const commentSchema = new mongoose.Schema(
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
        post:{
            // linking to user model
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'  // user collection name
        }
    },
{
    timestamps:true
})
//model
const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;