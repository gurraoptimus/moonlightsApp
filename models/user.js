const mongoose = require('mongoose');
const passwordLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}, 
    isMod: {type: Boolean, default: false} 
});

UserSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model('User', UserSchema);