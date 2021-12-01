const mongoose = require('mongoose');

const friendshipSchema = mongoose.Schema({
    'token' : { 
        type : String
    },
    'person' : { 
        type : String
    },
    'friend' : {
        type : String
    },
    'status' : {
        type : String
    }
},{
    timestamps : true,
})


module.exports = mongoose.model('Friendship', friendshipSchema);
