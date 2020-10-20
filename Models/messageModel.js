var mongoose = require('mongoose');

var Message = mongoose.model('Message', {
    messageID: String,
    name: String,
    emailId: String,
    message: String,
    userType: String,
    timestamp: Date
});

module.exports = Message;