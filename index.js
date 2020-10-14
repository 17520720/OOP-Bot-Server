var express = require('express');
var app = express();

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

app.post("/learn" , function(req, res){

     //xu lý chuỗi từ khóa
     let temp = req.body.keywords;
     let keywordList = temp.split(',');

     //xử lý dấu trắng và LowerCase các từ khóa
     for (let i = 0; i < keywordList.length; i++){
          if (keywordList[i][0] == " "){
               let temp = keywordList[i].split('');
               temp.splice(0, 1);
               
               keywordList[i] = temp.join('');
          }

          keywordList[i] = keywordList[i].toLowerCase();
     }

     //Tạo model 
     let newBotMessage = new BotMessage({
          title: req.body.title,
          keywords: keywordList,
          messageContent: req.body.messageContent
     });
     
     console.log(newBotMessage);
     //save model vào database
     // newBotMessage.save(function(err){
     //      if (err){
     //           console.log("Save Error: " + err);
     //           res.json({kq: 0});
     //      }else{
     //           console.log("Save Successfully!");
     //           res.render("learn");
     //      }
     // });
     //Thêm message
});

app.post("/api/learn", function(req, res){
     console.log(req.query.message);

     //demo
     BotMessage.findOne({title: 'Khái niệm Private'}, function(err, obj){
          res.json(obj);
     });
});