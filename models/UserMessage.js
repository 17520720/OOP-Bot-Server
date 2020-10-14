const mongoose = require('mongoose');

const userMessageSchema = new mongoose.Schema({
     messageContents: [{type: String}],
});

module.exports = mongoose.model("UserQuestion", userMessageSchema);