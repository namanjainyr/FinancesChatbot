var mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String
});

module.exports = UserDetail;