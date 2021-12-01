const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    'postToken' : { 
        type : String
    },
    'postContent' : {
        type : String
    },
    'privacy' : {
        type : String
    },
    'userToken' : {
        type : String
    },
    'sessionToken' : {
        type : String
    },

},{
    timestamps : true,
})


module.exports = mongoose.model('post', postSchema);
