const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name:  {type: String, require: true},
    email: {type: String, require: true},
    phone: {type: String, require: true},
    aboutUs: {type: String, require: true},
    sendEmail: {type: Boolean, default: false},
    contentful: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', userSchema);