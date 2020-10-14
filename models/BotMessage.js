const mongoose = require('mongoose');

const botMessageSchema = new mongoose.Schema({
     title: String,
     messageContent: String,
     keywords: [{type: String}],
});

module.exports = mongoose.model("BotMessage", botMessageSchema);