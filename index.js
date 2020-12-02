var express = require('express');
var app = express();
var vntk = require('vntk');

const fs = require('fs');
var classifier = new vntk.BayesClassifier();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(3000, () => {
     console.log('Server is started!');
});

app.use(function(req,res, next) {
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
     res.setHeader('Access-Control-Allow-Credentials', true);
     next();
});

//Body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//models
const UserMessage = require('./models/UserMessage');
const BotMessage = require('./models/BotMessage');
const { json } = require('body-parser');
const TrainingData = require('./models/TrainingData');
const { updateOne } = require('./models/UserMessage');

//connect database
mongoose.connect('mongodb+srv://admin:0123456543210@cluster0.1kujp.gcp.mongodb.net/OOPBot?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, err => {
     if (err) {
          console.log("error occurred: " + err);
     }
     else {
          console.log("Connected Successfully!");
     }
});

app.get("/", function(req, res){
     res.render("home"); 
});

app.get("/learn", function(req, res){
     res.render("learn");
});

app.get("/training", function(req, res){
     res.render("trainingPage");
});

app.post("/training" , function(req, res){

     //xu lý chuỗi từ khóa
     let temp = req.body.dataTraining;
     let data = temp.split('|');

     //xử lý dấu trắng và LowerCase các từ khóa
     for (let i = 0; i < data.length; i++){
          if (data[i][0] == " "){
               let temp = data[i].split('');
               temp.splice(0, 1);
               
               data[i] = temp.join('');
          }

          data[i] = data[i].toLowerCase();
     }

     //Tạo model 
     let newData = new TrainingData({
          label: req.body.label,
          dataTraining: data
     });
     
     console.log(newData);
     //save model vào database
     TrainingData.findOne({label: newData}, function(err, res){
          
     });

     newData.save(function(err){
          if (err){
               console.log("Save Error: " + err);
               res.json({kq: 0});
          }else{
               console.log("Save Successfully!");
               res.render("trainingPage");
          }
     });
     //Thêm message
});

app.post("/learn" , function(req, res){

     //xu lý chuỗi từ khóa
     let temp = req.body.keywords;
     let keywordList = temp.split('|');

     //xử lý dấu trắng và LowerCase các từ khóa
     for (let i = 0; i < keywordList.length; i++){
          if (keywordList[i][0] == " "){
               let temp = keywordList[i].split('');
               temp.splice(0, 1);
               
               keywordList[i] = temp.join('');
          }

          keywordList[i] = keywordList[i].toLowerCase();
     }

     // xu lys chuoi content mess
     let tempContent = req.body.messageContent;
     let messContentList = tempContent.split('|');
     // xu ly dau trang
     for (let i = 0; i < messContentList.length; i++){
          if (messContentList[i][0] == " ") {
               let tempContent = messContentList[i].split('');
               tempContent.splice(0, 1);

               messContentList[i] = tempContent.join('');
          }
     }

     //Tạo model 
     let newBotMessage = new BotMessage({
          title: req.body.title,
          keywords: keywordList,
          label: req.body.label,
          messageContent: messContentList,
     });
     
     console.log(newBotMessage);
     //save model vào database
     newBotMessage.save(function(err){
          if (err){
               console.log("Save Error: " + err);
               res.json({kq: 0});
          }else{
               console.log("Save Successfully!");
               res.render("learn");
          }
     });
     //Thêm message
});
app.get("/api/training", function(req, res){
     TrainingData.find(function(err, obj) {
          for (i = 0; i < obj.length; i++) {
               for (j = 0; j < obj[i].dataTraining.length; j++) {
                    classifier.addDocument(obj[i].dataTraining[j], obj[i].label);
                    classifier.train();
               }
          }
          res.json(obj);
     });
});
app.post("/api/learn", function(req, res){
     console.log(req.query.message);
     //test

     var _label = classifier.classify(req.query.message);
     console.log(_label);

     BotMessage.findOne({label: _label}, function(err, obj){
          res.json(obj);
     });
});
