const mongoose = require('mongoose');


const likeSchema = mongoose.Schema({
        user:{
            type:mongoose.Schema.ObjectId
        },
        // this defines the object id of the liked object
        likeable:{
            type:mongoose.Schema.ObjectId,
            require :true,
            refPath: 'onModel'
        },
        // this field is using for defining the type of the liked object since this is dynamic reference
        onModel:{
            type : String,
            require : true,
            enum : ['Post','Comment']
        }
    },
    {
        timeStamps:true
    }
);

const Like = mongoose.model('Like',likeSchema);

module.exports = Like;