const mongoose = require('mongoose');

const trainingDataSchema = new mongoose.Schema({
    label: String,
    dataTraining: [{type: String}],
});

module.exports = mongoose.model("TrainingData", trainingDataSchema);