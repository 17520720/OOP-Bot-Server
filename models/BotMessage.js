const mongoose = require('mongoose');

const botMessageSchema = new mongoose.Schema({
     title: String,
     messageContent: [{type: String}],
     label: String,
     keywords: [{type: String}],
});

module.exports = mongoose.model("BotMessage", botMessageSchema);