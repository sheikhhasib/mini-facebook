const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    'sessionToken' : { 
        type : String
    },
    'userToken' : {
        type : String
    },
    'ipAddress' : {
        type : String
    },
    'sessionEndedAt' : {
        type : String
    }

},{
    timestamps : true,
})


module.exports = mongoose.model('Session', sessionSchema);
