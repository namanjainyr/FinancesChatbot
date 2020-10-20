var mongoose = require('mongoose');

var ChannelActivity = mongoose.model('ChannelActivity', {
    activityID: String,
    name: String,
    emailId: String,
    isJoined: Boolean,
    joinedTimestamp: Date,
    isExited: Boolean,
    exitTimestamp: Date,
    chatCompleted: Boolean
});

module.exports = ChannelActivity;